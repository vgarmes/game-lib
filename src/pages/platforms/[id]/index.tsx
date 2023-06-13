import { useRouter } from 'next/router';
import LoadingScreen from '../../../components/common/LoadingScreen';
import Title from '../../../components/common/Title';
import GameList from '../../../components/GameList';
import { trpc } from '../../../utils/trpc';

const SinglePlatformPage = () => {
  const router = useRouter();

  const platformId = router.query.id;
  const { data: games, isLoading } = trpc.useQuery(
    ['game.by-platform-id', { id: parseInt(platformId as string) }],
    { enabled: typeof platformId === 'string' }
  );

  if (!games || isLoading) {
    return <LoadingScreen />;
  }
  return (
    <div>
      <Title className="text-center">{games[0].platform?.name}</Title>
      {games && <GameList games={games} />}
    </div>
  );
};

export default SinglePlatformPage;
