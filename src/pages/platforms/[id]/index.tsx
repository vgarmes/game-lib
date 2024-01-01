import { useRouter } from 'next/router';
import LoadingScreen from '../../../components/common/LoadingScreen';
import GameList from '../../../components/GameList';
import { trpc } from '../../../utils/trpc';
import PageTitle from '@/components/page-title';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import DefaultLayout from '@/components/layout/default';

const SinglePlatformPage = () => {
  const router = useRouter();
  const platformId = router.query.id;

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    trpc.game.byPlatformId.useInfiniteQuery(
      { id: parseInt(platformId as string), limit: 20 },
      {
        enabled: typeof platformId === 'string',
        getNextPageParam: (lastPage) => lastPage.nextPage,
      }
    );

  if (!data || isLoading) {
    return (
      <DefaultLayout>
        <LoadingScreen />
      </DefaultLayout>
    );
  }

  const flatData = data.pages.flatMap((page) => page.items);
  return (
    <DefaultLayout>
      <PageTitle title={flatData[0].platform?.name ?? 'Other'} />
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
    </DefaultLayout>
  );
};

export default SinglePlatformPage;
