import {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';
import { useRouter } from 'next/router';
import { getServerSession } from '../../server/common/get-server-session';
import { trpc } from '../../utils/trpc';
import GameForm, { DEFAULT_VALUES } from '../../components/GameForm';
import useZodForm from '../../utils/hooks/useZodForm';
import schema from '../../server/routers/game/schema';

const NewGame = () => {
  const router = useRouter();
  const createGame = trpc.useMutation('game.create', {
    onSuccess() {
      console.log('success!');
      router.push('/');
    },
  });

  return (
    <div>
      <h2 className="pb-6 text-3xl font-bold">New game</h2>
      <GameForm onSubmit={(values, _) => createGame.mutate(values)} />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getServerSession(context.req, context.res);

  if (!session || session.user.role !== 'ADMIN') {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
};

export default NewGame;
