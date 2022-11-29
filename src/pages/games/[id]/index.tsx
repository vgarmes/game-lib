import { useRouter } from 'next/router';
import GameDetails from '../../../components/GameDetails';
import { trpc } from '../../../utils/trpc';

const GameDetailsPage = () => {
  const router = useRouter();
  const { id } = router.query; // slug will be undefined during first renders

  const isValidId = !!id && !isNaN(parseInt(id as string));
  const numId = id ? parseInt(id as string) : 0;

  const { data: game, isLoading } = trpc.useQuery(
    ['game.by-id', { id: numId }],
    {
      enabled: isValidId,
    }
  );

  if (isLoading || !id) {
    return <p>Loading...</p>;
  }

  if (!game) {
    return <p>No game found with given id</p>;
  }

  const { id: gameId, ...initialValues } = game;

  return <GameDetails game={game} />;
};

export default GameDetailsPage;
