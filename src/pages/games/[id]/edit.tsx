import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import GameForm, { Schema } from '../../../components/GameForm';
import { getServerSession } from '../../../server/common/get-server-session';
import { trpc } from '../../../utils/trpc';
import { DirtyFields, getDirtyValues } from '../../../utils/forms';

const EditPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const isValidId = !!id && !isNaN(parseInt(id as string));
  const numId = id ? parseInt(id as string) : 0;

  const { mutate, isLoading: isSubmitting } = trpc.useMutation('game.update', {
    onSuccess() {
      console.log('success!');
      router.push(`/games/${id}`);
    },
  });

  const { data: game, isLoading } = trpc.useQuery(
    ['game.by-id', { id: numId }],
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

  const handleSubmit = (values: Schema, dirtyFields: DirtyFields<Schema>) => {
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

  return (
    <GameForm
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      defaultCoverUrl={game.cover?.secureUrl}
      initialValues={{
        ...restValues,
        platformId: platform?.id,
        coverId: cover?.id,
      }}
    />
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
