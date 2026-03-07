'use client';

import { useParams, useRouter } from 'next/navigation';
import LoadingScreen from '@/components/common/LoadingScreen';
import { trpc } from '@/trpc/client';
import PageTitle from '@/components/page-title';
import PlatformForm from '@/components/platform-form';
import { PlatformSchema } from '@/server/routers/platform/schema';
import { routes } from '@/constants';

export default function EditPlatformPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const numId = parseInt(id);
  const isValidId = !isNaN(numId);

  const { mutate, isPending: isSubmitting } = trpc.platform.update.useMutation({
    onSuccess() {
      router.push(routes.Platforms);
    },
  });

  const { data: platform, isLoading } = trpc.platform.byId.useQuery(
    { id: numId },
    { enabled: isValidId }
  );

  if (isLoading || !platform || !isValidId) {
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
}
