import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import GameDetails from '../../components/GameDetails';
import GameForm from '../../components/GameForm';
import { trpc } from '../../utils/trpc';

const EditGame = () => {
  const router = useRouter();
  const { id } = router.query; // slug will be undefined during first renders
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);

  const isValidId = !!id && !isNaN(parseInt(id as string));
  const numId = id ? parseInt(id as string) : 0;

  const { data: game, isLoading } = trpc.useQuery(
    ['game.by-id', { id: numId }],
    {
      enabled: isValidId,
    }
  );

  const updateGame = trpc.useMutation('game.update', {
    onSuccess() {
      console.log('success!');
      router.push(`/game/${id}`);
    },
  });

  if (isLoading || !id) {
    return <p>Loading...</p>;
  }

  if (!game) {
    return <p>No game found with given id</p>;
  }

  const { id: gameId, ...initialValues } = game;

  return (
    <div>
      {isEditing ? (
        <GameForm
          defaultValues={initialValues}
          defaultCoverUrl={initialValues.cover?.secureUrl}
          onSubmit={(values) => updateGame.mutate({ id: numId, ...values })}
        />
      ) : (
        <GameDetails game={game} onClickEdit={() => setIsEditing(true)} />
      )}
    </div>
  );
};

export default EditGame;
