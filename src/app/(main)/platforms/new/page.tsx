'use client';

import { useRouter } from 'next/navigation';
import { trpc } from '@/trpc/client';
import PlatformForm from '@/components/platform-form';
import PageTitle from '@/components/page-title';
import { routes } from '@/constants';
import { useSession } from 'next-auth/react';
import { Loader2 } from 'lucide-react';

export default function NewPlatformPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const { mutate: createPlatform, isPending } =
    trpc.platform.create.useMutation({
      onSuccess() {
        router.push(routes.Platforms);
      },
    });

  if (status === 'loading') {
    return (
      <div className="w-full flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (!session || session.user.role !== 'ADMIN') {
    router.push('/');
    return null;
  }

  return (
    <>
      <PageTitle title="New platform" />
      <PlatformForm onSubmit={createPlatform} isSubmitting={isPending} />
    </>
  );
}
