import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { getServerSession } from '../../server/common/get-server-session';
import { trpc } from '../../utils/trpc';
import GameForm from '../../components/GameForm';
import PageTitle from '@/components/page-title';
import { useToast } from '@/components/ui/use-toast';

const NewGame = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { mutate, isLoading } = trpc.game.create.useMutation({
    onSuccess() {
      toast({ title: 'Game created successfully!' });
      router.push('/');
    },
    onError() {
      toast({
        variant: 'destructive',
        title: 'Ups! Something went wrong.',
        description: 'There was a problem with your request.',
      });
    },
  });

  return (
    <div>
      <PageTitle
        title="New game"
        description="Add the details to create a new game."
      />
      <GameForm
        onSubmit={(values, _) => mutate(values)}
        isSubmitting={isLoading}
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

export default NewGame;
