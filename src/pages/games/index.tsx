import { useSession } from 'next-auth/react';
import { useState } from 'react';
import LoadingScreen from '../../components/common/LoadingScreen';
import GameList from '../../components/GameList';
import useDebounce from '../../utils/hooks/useDebounce';
import { trpc } from '../../utils/trpc';
import PageTitle from '@/components/page-title';

const size = 20;
const page = 0;

const GameResults = ({ query }: { query: string }) => {
  const { data: games, isLoading } = trpc.game.search.useQuery(
    { skip: size * page, query },
    { staleTime: 5000 }
  );

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!games || games.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        {query
          ? `No results for "${query}"`
          : 'Oooops! Something went wrong...'}
      </div>
    );
  }

  return (
    <>
      <PageTitle title="All games" description="All my games." />
      <GameList games={games} />
    </>
  );
};

const GamePage = () => {
  const { data: session } = useSession();
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 1000);
  return <GameResults query={debouncedQuery} />;
};

{
  /* <div className="flex w-full items-center justify-between gap-3 pt-6 pb-12">
  <div className="max-w-lg grow">
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50" />
      <Input
        type="search"
        placeholder="Search games..."
        className="pl-9"
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  </div>
  {session && (
    <Link href="/games/new" className={buttonVariants({ variant: 'default' })}>
      <Icon name="plus" />
      <span>Add game</span>
    </Link>
  )}
</div>; */
}
export default GamePage;
