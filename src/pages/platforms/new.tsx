import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import Form from '../../components/platform/Form';
import { getServerSession } from '../../server/common/get-server-session';
import { trpc } from '../../utils/trpc';

const NewPlatform = () => {
  const router = useRouter();
  const createPlatform = trpc.platform.create.useMutation({
    onSuccess() {
      router.push('/platforms');
    },
  });
  return (
    <div>
      <h2 className="pb-6 text-3xl font-bold">New platform</h2>
      <Form onSubmit={createPlatform.mutate} />
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

export default NewPlatform;
