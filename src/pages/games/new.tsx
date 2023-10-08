import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { getServerSession } from '../../server/common/get-server-session';
import { trpc } from '../../utils/trpc';
import GameForm from '../../components/GameForm';
import PageTitle from '@/components/page-title';

const NewGame = () => {
  const router = useRouter();
  const { mutate, isLoading } = trpc.game.create.useMutation({
    onSuccess() {
      console.log('success!');
      router.push('/');
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
