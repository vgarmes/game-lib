import { Game } from '@prisma/client';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import GameDetails from '../../components/GameDetails';
import GameForm from '../../components/GameForm';
import { getServerSession } from '../../server/common/get-server-session';
import { trpc } from '../../utils/trpc';

const EditGame = () => {
  const router = useRouter();
  const { slug } = router.query; // slug will be undefined during first renders
  const stringId = slug?.[0];

  const id = stringId ? parseInt(stringId) : 0;
  const isValidId = !!stringId && !isNaN(parseInt(stringId));
  const isEdit = false; //temporary

  const { data: game, isLoading } = trpc.useQuery(['game.by-id', { id }], {
    enabled: isValidId,
  });

  const updateGame = trpc.useMutation('game.update', {
    onSuccess() {
      console.log('success!');
      router.push(`/game/${id}`);
    },
  });

  if (isLoading || !slug) {
    return <p>Loading...</p>;
  }

  if (!game) {
    return <p>No game found with given id</p>;
  }

  if (isEdit) {
    return (
      <GameForm
        initialValues={game}
        onSubmit={(values) => updateGame.mutate({ id, ...values })}
      />
    );
  }

  return <GameDetails game={game} />;
};

export default EditGame;
