import { useRouter } from 'next/router';
import LoadingScreen from '../../../components/common/LoadingScreen';
import GameList from '../../../components/GameList';
import { trpc } from '../../../utils/trpc';
import PageTitle from '@/components/page-title';

const SinglePlatformPage = () => {
  const router = useRouter();

  const platformId = router.query.id;
  const { data: games, isLoading } = trpc.game.byPlatformId.useQuery(
    { id: parseInt(platformId as string) },
    { enabled: typeof platformId === 'string' }
  );

  if (!games || isLoading) {
    return <LoadingScreen />;
  }
  return (
    <div>
      <PageTitle title={games[0].platform?.name ?? 'Other'} />
      {games && <GameList games={games} />}
    </div>
  );
};

export default SinglePlatformPage;
