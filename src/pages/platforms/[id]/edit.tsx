import { useRouter } from 'next/router';
import LoadingScreen from '../../../components/common/LoadingScreen';
import parseId from '../../../utils/parse-id';
import { trpc } from '../../../utils/trpc';
import PageTitle from '@/components/page-title';
import PlatformForm from '@/components/platform-form';
import { PlatformSchema } from '@/server/routers/platform/schema';
import { routes } from '@/constants';

const EditPlatform = () => {
  const router = useRouter();
  const { id } = router.query;

  const { numId, isValidId } = parseId(id);

  const { mutate, isPending: isSubmitting } = trpc.platform.update.useMutation({
    onSuccess() {
      console.log('success!');
      router.push(routes.Platforms);
    },
  });

  const { data: platform, isLoading } = trpc.platform.byId.useQuery(
    { id: numId! },
    {
      enabled: isValidId,
    }
  );

  if (isLoading || !platform || !numId) {
    return <LoadingScreen />;
  }

  const cleanValues = Object.fromEntries(
    Object.entries(platform).filter(([_key, value]) => value !== null)
  ) as PlatformSchema;

  return (
    <div>
      <PageTitle
        title={platform.name}
        description={platform.manufacturer ?? ''}
      />
      <PlatformForm
        initialValues={cleanValues}
        onSubmit={(values) => mutate({ id: numId, ...values })}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default EditPlatform;
