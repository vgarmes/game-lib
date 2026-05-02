"use client";

import { trpc } from "@/trpc/client";
import { PageLayout } from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GameRow, GameRowSkeleton } from "@/components/game-row";
import { Plus, Search } from "lucide-react";
import { PlatformSelector } from "@/components/platform-selector";
import {
  parseAsArrayOf,
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
  useQueryStates,
} from "nuqs";
import { Suspense, useState } from "react";
import { useIsAdmin } from "@/utils/hooks/use-is-admin";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { StatusSelector } from "@/components/status-selector";
import { GAME_STATUSES } from "@/constants";
import { GameSheet } from "@/components/game-sheet";

export default function GamesPage() {
  const isAdmin = useIsAdmin();
  return (
    <PageLayout
      breadcrumbs={
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Games</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      }
      actions={
        isAdmin && (
          <Button nativeButton={false} render={<Link href="/games/new" />}>
            <Plus />
            New game
          </Button>
        )
      }
    >
      <Suspense>
        <Content />
      </Suspense>
    </PageLayout>
  );
}

function Content() {
  const [selectedGameId, setSelectedGameId] = useState<number | null>(null);
  const [query, setQuery] = useQueryStates({
    searchText: parseAsString.withDefault(""),
    platformId: parseAsInteger,
    status: parseAsArrayOf(parseAsStringLiteral(GAME_STATUSES)).withDefault([]),
  });

  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    trpc.game.list.useInfiniteQuery(
      { limit: 50, ...query },
      {
        getNextPageParam: (lastPage) => lastPage.nextPage,
        initialCursor: 0,
      },
    );

  const flatData = data?.pages.flatMap((page) => page.items) ?? [];

  const selectedGame = flatData.find((game) => game.id === selectedGameId);

  return (
    <div className="flex flex-col gap-4 px-4 pb-4 lg:px-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Input
            className="h-10 pl-8"
            placeholder="Search games..."
            value={query.searchText}
            onChange={(e) => setQuery({ searchText: e.target.value })}
          />
          <Search className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
        </div>
        <PlatformSelector
          selectedId={query.platformId}
          onSelect={(value) =>
            setQuery({
              platformId: query.platformId === value ? null : value,
            })
          }
          className="w-full md:w-[200px]"
          placeholder="All platforms"
        />
        <StatusSelector
          status={query.status.length === 0 ? [...GAME_STATUSES] : query.status}
          onChange={(value) => setQuery({ status: value })}
        />
      </div>
      <div className="flex flex-col gap-2 md:gap-0">
        {isLoading
          ? Array.from({ length: 20 }, (_, index) => (
              <GameRowSkeleton key={index} />
            ))
          : flatData.map((game) => (
              <GameRow key={game.id} game={game} onClick={setSelectedGameId} />
            ))}
      </div>
      {hasNextPage && (
        <Button
          variant="outline"
          className="h-10"
          onClick={() => {
            fetchNextPage();
          }}
          disabled={isFetchingNextPage}
        >
          Load More
        </Button>
      )}
      <GameSheet
        open={!!selectedGame}
        game={selectedGame}
        onClose={() => setSelectedGameId(null)}
      />
    </div>
  );
}
