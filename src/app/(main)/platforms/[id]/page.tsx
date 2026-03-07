'use client';

import { useParams } from 'next/navigation';
import LoadingScreen from '@/components/common/LoadingScreen';
import GameList from '@/components/GameList';
import { trpc } from '@/trpc/client';
import PageTitle from '@/components/page-title';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function SinglePlatformPage() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    trpc.game.byPlatformId.useInfiniteQuery(
      { id: parseInt(id), limit: 20 },
      {
        enabled: typeof id === 'string',
        getNextPageParam: (lastPage) => lastPage.nextPage,
        initialCursor: 0,
      }
    );

  if (!data || isLoading) {
    return <LoadingScreen />;
  }

  const flatData = data.pages.flatMap((page) => page.items);

  return (
    <>
      <PageTitle title={flatData[0]?.platform?.name ?? 'Other'} />
      <GameList games={flatData} />
      {hasNextPage && (
        <div className="w-full flex justify-center">
          <Button
            variant="outline"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              'Load more'
            )}
          </Button>
        </div>
      )}
    </>
  );
}
