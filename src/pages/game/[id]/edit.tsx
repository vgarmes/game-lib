import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import GameForm, { DEFAULT_VALUES, Schema } from '../../../components/GameForm';
import { getServerSession } from '../../../server/common/get-server-session';
import useZodForm from '../../../utils/hooks/useZodForm';
import { trpc } from '../../../utils/trpc';
import schema from '../../../server/routers/game/schema';
import { prisma } from '../../../server/prisma';
import { Game } from '@prisma/client';
import { DirtyFields, getDirtyValues } from '../../../utils/forms';
import { inferQueryOutput } from '../../../utils/trpc';

const EditPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const isValidId = !!id && !isNaN(parseInt(id as string));
  const numId = id ? parseInt(id as string) : 0;

  const updateGame = trpc.useMutation('game.update', {
    onSuccess() {
      console.log('success!');
      router.push(`/game/${id}`);
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
    return updateGame.mutate({ id: game.id, ...updatedValues });
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
