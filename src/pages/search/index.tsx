import { useSession } from 'next-auth/react';
import LoadingScreen from '../../components/common/LoadingScreen';
import GameList from '../../components/GameList';
import { trpc } from '../../utils/trpc';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import DefaultLayout from '@/components/layout/default';
import { Games } from '@/types/trpc';
import { useSearch } from '@/utils/search';

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

const GamePage = () => {
  const { data: session } = useSession();
  const { query, isReady } = useSearch();

  const { data: games, isLoading } = trpc.game.search.useQuery(
    { skip: size * page, query },
    { enabled: isReady }
  );

  return (
    <DefaultLayout withSearch>
      {session && (
        <Link
          href="/games/new"
          className={buttonVariants({ variant: 'default' })}
        >
          <Plus size={16} />
          <span className="hidden md:inline-block md:ml-1">New game</span>
        </Link>
      )}

      <Content games={games} isLoading={isLoading} searchTerm={query} />
    </DefaultLayout>
  );
};

export default GamePage;
