import { useSession } from 'next-auth/react';
import { useRef, useState } from 'react';
import LoadingScreen from '../../components/common/LoadingScreen';
import GameList from '../../components/GameList';
import { trpc } from '../../utils/trpc';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import DefaultLayout from '@/components/layout/default';
import { useRouter } from 'next/router';
import { Games } from '@/types/trpc';

const size = 20;
const page = 0;

const Content: React.FC<{
  games?: Games;
  isLoading: boolean;
  searchTerm: string;
}> = ({ games, searchTerm, isLoading }) => {
  if (!games && isLoading) {
    return <LoadingScreen />;
  }

  if (!games || games.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        {searchTerm
          ? `No results for "${searchTerm}"`
          : 'Oooops! Something went wrong...'}
      </div>
    );
  }

  return <GameList games={games} />;
};

type Timeout = ReturnType<typeof setTimeout>;

const GamePage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { title } = router.query;
  const isRouterReady = router.isReady;

  const timeoutId = useRef<Timeout>();
  const searchedTitle = typeof title === 'string' ? title : '';
  const { data: games, isLoading } = trpc.game.search.useQuery(
    { skip: size * page, query: searchedTitle },
    { enabled: isRouterReady }
  );

  const [inputQuery, setInputQuery] = useState('');
  const [hasParsedInitialQuery, setHasParsedInitialQuery] = useState(false);

  // sets the initial value of the search bar to the query parameter, if any
  if (!hasParsedInitialQuery && isRouterReady) {
    setHasParsedInitialQuery(true);
    if (searchedTitle) {
      setInputQuery(searchedTitle);
    }
  }

  const handleSearch = (value: string) => {
    setInputQuery(value);
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }
    timeoutId.current = setTimeout(() => {
      router.push({
        pathname: router.pathname,
        query: value ? { title: value } : null,
      });
    }, 500);
  };

  return (
    <DefaultLayout>
      <div className="flex w-full items-center justify-between gap-3 py-6">
        <div className="max-w-lg grow">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50" />
            <Input
              type="search"
              placeholder="Search games..."
              className="pl-9"
              value={inputQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>
        {session && (
          <Link
            href="/games/new"
            className={buttonVariants({ variant: 'default' })}
          >
            <Plus size={16} />
            <span className="hidden md:inline-block md:ml-1">New game</span>
          </Link>
        )}
      </div>
      <Content games={games} isLoading={isLoading} searchTerm={searchedTitle} />
    </DefaultLayout>
  );
};

export default GamePage;
