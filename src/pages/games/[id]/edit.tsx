import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import GameForm from '../../../components/GameForm';
import { getServerSession } from '../../../server/common/get-server-session';
import { trpc } from '../../../utils/trpc';
import { DirtyFields, getDirtyValues } from '../../../utils/forms';
import { GameSchema } from '@/server/routers/game/schema';
import { useToast } from '@/components/ui/use-toast';
import { routes } from '@/constants';

const EditPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { toast } = useToast();
  const isValidId = !!id && !isNaN(parseInt(id as string));
  const numId = id ? parseInt(id as string) : 0;

  const { mutate, isLoading: isSubmitting } = trpc.game.update.useMutation({
    onSuccess() {
      toast({ title: 'Game edited successfully!' });
      router.push(routes.Platforms);
    },
    onError() {
      toast({
        variant: 'destructive',
        title: 'Ups! Something went wrong.',
        description: 'There was a problem with your request.',
      });
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

  // eslint-ignore
  const {
    id: _id,
    platform,
    cover,
    createdAt: _createdAt,
    updatedAt: _updatedAt,
    ...restValues
  } = game;

  const cleanValues = Object.fromEntries(
    Object.entries(restValues).filter(([_key, value]) => value !== null)
  ) as GameSchema;

  return (
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
