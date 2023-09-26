import Link from 'next/link';
import { Badge } from '../../components/common';
import LoadingScreen from '../../components/common/LoadingScreen';
import Title from '../../components/common/Title';
import { groupBy } from '../../utils';
import { trpc } from '../../utils/trpc';
import PageTitle from '@/components/page-title';

const PlatformPage = () => {
  const { data: platforms, isLoading } = trpc.platform.count.useQuery();

  if (isLoading || !platforms) {
    return <LoadingScreen />;
  }

  const groupedPlatforms = groupBy(platforms, 'manufacturer');
  return (
    <div>
      <PageTitle
        title="Platforms"
        description="All my games grouped by their platform."
      />
      <ul>
        {Object.entries(groupedPlatforms).map(([platform, entries]) => (
          <li key={platform} className="pb-3">
            <p className="pb-3 text-lg font-bold">{platform}</p>
            {entries.map((entry) => (
              <Link
                key={entry.id}
                href={`/platforms/${entry.id.toString()}`}
                className="flex items-center gap-3 pb-3"
              >
                <p>{entry.name}</p>
                <Badge text={`${entry._count.games} games`} color="pink" />
              </Link>
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlatformPage;
