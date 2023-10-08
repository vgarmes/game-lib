import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import GameForm from '../../../components/GameForm';
import { getServerSession } from '../../../server/common/get-server-session';
import { trpc } from '../../../utils/trpc';
import { DirtyFields, getDirtyValues } from '../../../utils/forms';
import PageTitle from '@/components/page-title';
import { GameSchema } from '@/server/routers/game/schema';

const EditPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const isValidId = !!id && !isNaN(parseInt(id as string));
  const numId = id ? parseInt(id as string) : 0;

  const { mutate, isLoading: isSubmitting } = trpc.game.update.useMutation({
    onSuccess() {
      console.log('success!');
      router.push(`/games/${id}`);
    },
  });

  const { data: game, isLoading } = trpc.game.byId.useQuery(
    { id: numId },
    {
      enabled: isValidId,
    }
  );

  if (isLoading || !id) {
    return <div>loading...</div>;
  }

  if (!game) {
    return <p>No game found with given id</p>;
  }

  const handleSubmit = (
    values: GameSchema,
    dirtyFields: DirtyFields<GameSchema>
  ) => {
    const updatedValues = getDirtyValues(values, dirtyFields);
    return mutate({ id: game.id, ...updatedValues });
  };

  const {
    id: gameId,
    platform,
    cover,
    createdAt,
    updatedAt,
    ...restValues
  } = game;

  const cleanValues = Object.fromEntries(
    Object.entries(restValues).filter(([_key, value]) => value !== null)
  ) as GameSchema;

  return (
    <div>
      <PageTitle
        title="Edit game"
        description="Edit the details of the game."
      />

      <GameForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        defaultCoverUrl={game.cover?.secureUrl}
        initialValues={{
          ...cleanValues,
          platformId: platform?.id,
          coverId: cover?.id,
        }}
      />
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

export default EditPage;
