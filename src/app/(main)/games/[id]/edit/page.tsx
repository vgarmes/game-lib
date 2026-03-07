'use client';

import { useParams, useRouter } from 'next/navigation';
import GameForm from '@/components/GameForm';
import { trpc } from '@/trpc/client';
import { DirtyFields, getDirtyValues } from '@/utils/forms';
import { GameSchema } from '@/server/routers/game/schema';
import { toast } from 'sonner';
import { routes } from '@/constants';
import { useSession } from 'next-auth/react';
import { Loader2 } from 'lucide-react';

export default function EditGamePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session, status } = useSession();

  const numId = parseInt(params.id);
  const isValidId = !isNaN(numId);

  const { mutate, isPending: isSubmitting } = trpc.game.update.useMutation({
    onSuccess() {
      toast('Game edited successfully!');
      router.push(routes.Platforms);
    },
    onError() {
      toast.error('Ups! Something went wrong.', {
        description: 'There was a problem with your request.',
      });
    },
  });

  const { data: game, isLoading } = trpc.game.byId.useQuery(
    { id: numId },
    { enabled: isValidId }
  );

  if (status === 'loading' || isLoading) {
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

  if (!game) {
    return <p>No game found with given id</p>;
  }

  const handleSubmit = (
    values: GameSchema,
    dirtyFields: DirtyFields<GameSchema>
  ) => {
    const updatedValues = getDirtyValues(values, dirtyFields);
    return mutate({ id: game.id, ...updatedValues });
  };

  const {
    id: _id,
    platform,
    cover,
    createdAt: _createdAt,
    updatedAt: _updatedAt,
    ...restValues
  } = game;

  const cleanValues = Object.fromEntries(
    Object.entries(restValues).filter(([_key, value]) => value !== null)
  ) as GameSchema;

  return (
    <GameForm
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      defaultCoverUrl={game.cover?.secureUrl}
      initialValues={{
        ...cleanValues,
        platformId: platform?.id,
        coverId: cover?.id,
      }}
    />
  );
}
