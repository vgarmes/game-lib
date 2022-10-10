import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { getServerSession } from '../../server/common/get-server-session';
import { trpc } from '../../utils/trpc';

const EditGame = () => {
  const route = useRouter();
  const { slug } = route.query;
  const id = slug?.[0];
  const query = slug?.[1];

  const isValidId = !!id && !isNaN(parseInt(id));
  const isEdit = query === 'edit';

  const { data, isLoading } = trpc.useQuery(
    ['game.by-id', { id: parseInt(id as string) }],
    { enabled: isValidId }
  );

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return <>{isEdit && 'Edit mode'}</>;
};

export const getServerSideProps = async (
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

export default EditGame;
