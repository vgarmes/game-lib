import { useRouter } from 'next/router';
import LoadingScreen from '../../../components/common/LoadingScreen';
import Title from '../../../components/common/Title';
import parseId from '../../../utils/parse-id';
import { trpc } from '../../../utils/trpc';
import Form from '../../../components/platform/Form';

const EditPlatform = () => {
  const router = useRouter();
  const { id } = router.query;

  const { numId, isValidId } = parseId(id);

  const { mutate, isLoading: isSubmitting } = trpc.useMutation(
    'platform.update',
    {
      onSuccess() {
        console.log('success!');
        router.push('/platform');
      },
    }
  );

  const { data: platform, isLoading } = trpc.useQuery(
    ['platform.by-id', { id: numId! }],
    {
      enabled: isValidId,
    }
  );

  if (isLoading || !platform || !numId) {
    return <LoadingScreen />;
  }

  return (
    <div>
      <Title>{`${platform.name} - ${platform.manufacturer}`}</Title>
      <Form
        initialValues={platform}
        onSubmit={(values) => mutate({ id: numId, ...values })}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default EditPlatform;
