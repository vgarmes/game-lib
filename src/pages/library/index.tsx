import Link from 'next/link';
import { groupBy } from '../../utils';
import DefaultLayout from '@/components/layout/default';
import { GetStaticPropsContext, InferGetStaticPropsType } from 'next';
import prisma from '../../server/prisma';
import superjson from 'superjson';
import type { Platform } from '@prisma/client';

type GroupedPlatform = Platform & {
  _count: {
    games: number;
  };
};

const PlatformPage = (
  props: InferGetStaticPropsType<typeof getStaticProps>
) => {
  const parsedCount = superjson.parse(
    props.gameCountByPlatform
  ) as GroupedPlatform[];
  const groupedPlatforms = groupBy(
    parsedCount,
    (parsedCount) => parsedCount.manufacturer!
  );
  return (
    <DefaultLayout>
      <div className="flex flex-col w-full">
        {Array.from(groupedPlatforms.entries()).map(([platform, entries]) => (
          <div key={platform} className="pb-3">
            <h3 className="pb-3 text-2xl font-bold">{platform}</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 pb-3 gap-3">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent relative"
                >
                  <Link
                    href={`/platforms/${entry.id.toString()}`}
                    className="text-lg font-bold"
                  >
                    <span className="absolute inset-0"></span>
                    {entry.name}
                  </Link>
                  <p className="text-muted-foreground">
                    {`${entry._count.games} ${
                      entry._count.games === 1 ? 'game' : 'games'
                    }`}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </DefaultLayout>
  );
};

export async function getStaticProps(_context: GetStaticPropsContext) {
  const gameCountByPlatform = await prisma.platform.findMany({
    include: {
      _count: {
        select: { games: true },
      },
    },
    orderBy: [
      {
        manufacturer: 'asc',
      },
      { name: 'asc' },
    ],
  });

  return {
    props: {
      gameCountByPlatform: superjson.stringify(gameCountByPlatform),
    },
  };
}

export default PlatformPage;
