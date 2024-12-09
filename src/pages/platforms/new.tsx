import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { getServerSession } from '../../server/common/get-server-session';
import { trpc } from '../../utils/trpc';
import PlatformForm from '@/components/platform-form';
import PageTitle from '@/components/page-title';
import { routes } from '@/constants';

const NewPlatform = () => {
  const router = useRouter();
  const { mutate: createPlatform, isLoading } =
    trpc.platform.create.useMutation({
      onSuccess() {
        router.push(routes.Platforms);
      },
    });
  return (
    <>
      <PageTitle title="New platform" />
      <PlatformForm onSubmit={createPlatform} isSubmitting={isLoading} />
    </>
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
