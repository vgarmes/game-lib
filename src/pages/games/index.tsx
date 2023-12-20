import { useSession } from 'next-auth/react';
import { useState } from 'react';
import LoadingScreen from '../../components/common/LoadingScreen';
import GameList from '../../components/GameList';
import useDebounce from '../../utils/hooks/useDebounce';
import { trpc } from '../../utils/trpc';
import PageTitle from '@/components/page-title';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import DefaultLayout from '@/components/layout/default';

const size = 20;
const page = 0;

const Content: React.FC<{ searchTerm: string }> = ({ searchTerm }) => {
  const { data: games, isLoading } = trpc.game.search.useQuery(
    { skip: size * page, query: searchTerm },
    { staleTime: 5000 }
  );

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

const GamePage = () => {
  const { data: session } = useSession();
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 1000);

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
              value={query}
              onChange={(e) => setQuery(e.target.value)}
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
      <PageTitle title="All games" description="All my games." />
      <Content searchTerm={debouncedQuery} />
    </DefaultLayout>
  );
};

export default GamePage;
