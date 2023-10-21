import Link from 'next/link';
import { Badge } from '../../components/common';
import LoadingScreen from '../../components/common/LoadingScreen';
import { groupBy } from '../../utils';
import { trpc } from '../../utils/trpc';
import PageTitle from '@/components/page-title';
import { buttonVariants } from '@/components/ui/button';
import clsx from 'clsx';
import { Plus } from 'lucide-react';
import { useSession } from 'next-auth/react';
import DefaultLayout from '@/components/layout/default';

const PlatformPage = () => {
  const { data: platforms, isLoading } = trpc.platform.count.useQuery();
  const { data: session } = useSession();

  if (isLoading || !platforms) {
    return <LoadingScreen />;
  }

  const groupedPlatforms = groupBy(platforms, 'manufacturer');
  return (
    <DefaultLayout>
      <div className="flex flex-col w-full">
        {session && (
          <Link
            href="/platforms/new"
            className={clsx(buttonVariants({ variant: 'default' }), 'ml-auto')}
          >
            <Plus />
            <span className="hidden md:inline-block">New platform</span>
          </Link>
        )}
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
    </DefaultLayout>
  );
};

export default PlatformPage;
