import {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';
import { useRouter } from 'next/router';
import { getServerSession } from '../../server/common/get-server-session';
import newGameSchema from '../../server/routers/game/schema';
import useZodForm from '../../utils/hooks/useZodForm';
import { trpc } from '../../utils/trpc';
import { prisma } from '../../server/prisma';
import GameForm from '../../components/GameForm';

const defaultValues = {
  title: '',
  inCollection: false,
  completed: false,
  edition: undefined,
  releaseDate: undefined,
  completedDate: undefined,
  buyDate: undefined,
  buyPrice: undefined,
  developerId: undefined,
  rating: undefined,
  comment: undefined,
  platformId: undefined,
  coverId: undefined,
};

const NewGame = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const router = useRouter();
  const { data: platforms } = props;
  const createGame = trpc.useMutation('game.create', {
    onSuccess() {
      console.log('success!');
      router.push('/');
    },
  });
  const {
    register,
    formState: { errors },
    setValue,
    handleSubmit,
    getValues,
  } = useZodForm({
    schema: newGameSchema,
    defaultValues,
  });

  return (
    <div>
      <h2 className="pb-6 text-3xl font-bold">New game</h2>
      <GameForm
        defaultValues={defaultValues}
        onSubmit={createGame.mutate}
        platforms={platforms}
      />
    </div>
  );
};

interface SSProps {
  data: Array<{ id: number; name: string }>;
}
export const getServerSideProps: GetServerSideProps<SSProps> = async (
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

  const data = await prisma.platform.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  return {
    props: { session, data },
  };
};

export default NewGame;
