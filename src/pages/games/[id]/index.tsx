import { useRouter } from 'next/router';
import GameDetails from '../../../components/GameDetails';
import parseId from '../../../utils/parse-id';
import { trpc } from '../../../utils/trpc';
import Layout from '@/components/layout/default';

const GameDetailsPage = () => {
  const router = useRouter();
  const { id } = router.query; // slug will be undefined during first renders

  const { numId, isValidId } = parseId(id);

  const { data: game, isLoading } = trpc.game.byId.useQuery(
    { id: numId! },
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

  return (
    <Layout>
      <GameDetails game={game} />
    </Layout>
  );
};

export default GameDetailsPage;
