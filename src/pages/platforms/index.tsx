import LoadingScreen from '../../components/common/LoadingScreen';
import Title from '../../components/common/Title';
import { trpc } from '../../utils/trpc';

const PlatformPage = () => {
  const { data: platforms, isLoading } = trpc.useQuery(['platform.get-all']);

  if (isLoading || !platforms) {
    return <LoadingScreen />;
  }
  return (
    <div>
      <Title>Platforms</Title>
      <ul>
        {platforms.map((platform) => (
          <li
            key={platform.id}
          >{`${platform.manufacturer} - ${platform.name}`}</li>
        ))}
      </ul>
    </div>
  );
};

export default PlatformPage;
