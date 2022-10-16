import { Game } from '@prisma/client';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import GameDetails from '../../components/GameDetails';
import GameForm from '../../components/GameForm';
import { getServerSession } from '../../server/common/get-server-session';
import { trpc } from '../../utils/trpc';

const EditGame = () => {
  const router = useRouter();
  const { id } = router.query; // slug will be undefined during first renders

  const isValidId = !!id && !isNaN(parseInt(id as string));
  const numId = id ? parseInt(id as string) : 0;
  const isEdit = false; //temporary

  const { data: game, isLoading } = trpc.useQuery(
    ['game.by-id', { id: numId }],
    {
      enabled: isValidId,
    }
  );

  const updateGame = trpc.useMutation('game.update', {
    onSuccess() {
      console.log('success!');
      router.push(`/game/${id}`);
    },
  });

  if (isLoading || !id) {
    return <p>Loading...</p>;
  }

  if (!game) {
    return <p>No game found with given id</p>;
  }

  if (isEdit) {
    return (
      <GameForm
        initialValues={game}
        onSubmit={(values) => updateGame.mutate({ id: numId, ...values })}
      />
    );
  }

  return <GameDetails game={game} />;
};

export default EditGame;
