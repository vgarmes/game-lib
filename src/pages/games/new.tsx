import { useRouter } from 'next/router';
import { trpc } from '../../utils/trpc';
import GameForm from '../../components/GameForm';
import PageTitle from '@/components/page-title';
import { useToast } from '@/components/ui/use-toast';
import { useSession } from 'next-auth/react';
import { Loader } from 'lucide-react';

const NewGame = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const { mutate, isLoading } = trpc.game.create.useMutation({
    onSuccess() {
      toast({ title: 'Game created successfully!' });
      router.push('/');
    },
    onError() {
      toast({
        variant: 'destructive',
        title: 'Ups! Something went wrong.',
        description: 'There was a problem with your request.',
      });
    },
  });

  if (status === 'loading') {
    return (
      <div className="w-full flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!session || session.user.role !== 'ADMIN') {
    router.push('/');
    return null;
  }

  return (
    <div>
      <PageTitle
        title="New game"
        description="Add the details to create a new game."
      />
      <GameForm
        onSubmit={(values, _) => mutate(values)}
        isSubmitting={isLoading}
      />
    </div>
  );
};

export default NewGame;
