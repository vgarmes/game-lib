import { useRouter } from 'next/router';
import LoadingScreen from '../../../components/common/LoadingScreen';
import parseId from '../../../utils/parse-id';
import { trpc } from '../../../utils/trpc';
import Form from '../../../components/platform/Form';
import PageTitle from '@/components/page-title';

const EditPlatform = () => {
  const router = useRouter();
  const { id } = router.query;

  const { numId, isValidId } = parseId(id);

  const { mutate, isLoading: isSubmitting } = trpc.platform.update.useMutation({
    onSuccess() {
      console.log('success!');
      router.push('/platform');
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

  return (
    <div>
      <PageTitle
        title={platform.name}
        description={platform.manufacturer ?? ''}
      />
      <Form
        initialValues={platform}
        onSubmit={(values) => mutate({ id: numId, ...values })}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default EditPlatform;
