import { useRouter } from 'next/router';
import LoadingScreen from '../../components/common/LoadingScreen';
import GameList from '../../components/GameList';
import { trpc } from '../../utils/trpc';
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

const GamePage = () => {
  const { query } = useRouter();

  const { data: games, isLoading } = trpc.game.search.useQuery(
    {
      skip: size * page,
      query: query.q as string,
    },
    {
      enabled: typeof query.q === 'string',
    }
  );

  return (
    <Content
      games={games}
      isLoading={isLoading}
      searchTerm={query.q as string}
    />
  );
};

export default GamePage;
