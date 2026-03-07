import Link from 'next/link';
import { groupBy } from '@/utils';
import prisma from '@/server/prisma';

export default async function PlatformsPage() {
  const platforms = await prisma.platform.findMany({
    include: { _count: { select: { games: true } } },
    orderBy: [{ manufacturer: 'asc' }, { name: 'asc' }],
  });
  const groupedPlatforms = groupBy(platforms, (p) => p.manufacturer!);

  return (
    <div className="flex flex-col w-full">
      {Array.from(groupedPlatforms.entries()).map(([manufacturer, entries]) => (
        <div key={manufacturer} className="pb-3">
          <h3 className="pb-3 text-2xl font-bold">{manufacturer}</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 pb-3 gap-3">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent relative"
              >
                <Link
                  href={`/platforms/${entry.id}`}
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
  );
}
