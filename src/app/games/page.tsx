"use client";

import { trpc } from "@/trpc/client";
import { PageLayout } from "@/components/page-layout";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Stars } from "@/components/stars";
import { Plus, Search } from "lucide-react";
import { PlatformSelector } from "@/components/platform-selector";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
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
import { Skeleton } from "@/components/ui/skeleton";

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "long",
});

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
          <Button render={<Link href="/games/new" />}>
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

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function RowSkeleton() {
  return (
    <div className="bg-card flex flex-col gap-4 overflow-hidden rounded-lg border p-4 md:grid md:grid-cols-[3fr_1fr_minmax(0,100px)] md:gap-8 md:rounded-none md:not-last:border-b-0 md:first:rounded-t-lg md:last:rounded-b-lg">
      <div className="flex w-full items-center gap-4 overflow-hidden">
        <div className="relative size-12 shrink-0 overflow-hidden rounded">
          <Skeleton className="size-12 rounded" />
        </div>

        <div className="flex flex-1 flex-col gap-4 overflow-hidden">
          <div className="flex min-w-0 items-center gap-2">
            <Skeleton
              className="h-3 w-full"
              style={{ maxWidth: getRandomInt(100, 300) }}
            />
          </div>
          <Skeleton
            className="h-3"
            style={{ maxWidth: getRandomInt(50, 100) }}
          />
        </div>
      </div>

      <div className="flex w-full flex-col overflow-hidden md:items-end">
        <Skeleton className="h-4 w-26" />
      </div>

      <div className="flex w-full justify-between gap-2 overflow-hidden md:flex-col">
        <Skeleton className="h-3 w-full max-w-25" />
        <Skeleton className="h-3 w-full max-w-20" />
      </div>
    </div>
  );
}

function Content() {
  const [query, setQuery] = useQueryStates({
    searchText: parseAsString.withDefault(""),
    platformId: parseAsInteger,
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
      </div>
      <div className="flex flex-col gap-2 md:gap-0">
        {isLoading
          ? Array.from({ length: 20 }, (_, index) => (
              <RowSkeleton key={index} />
            ))
          : flatData.map((game) => (
              <div
                key={game.id}
                className="bg-background-100 flex flex-col gap-4 overflow-hidden rounded-lg border p-4 md:grid md:grid-cols-[3fr_1fr_minmax(0,100px)] md:gap-8 md:rounded-none md:not-last:border-b-0 md:first:rounded-t-lg md:last:rounded-b-lg"
              >
                <div className="flex items-center gap-4 overflow-hidden">
                  <div className="relative size-12 shrink-0 overflow-hidden rounded">
                    <Image
                      alt={game.title}
                      src={game.cover?.secureUrl ?? "/placeholder.png"}
                      fill
                      className="h-full w-full rounded object-cover"
                    />
                  </div>

                  <div className="flex flex-col gap-2 overflow-hidden">
                    <div className="flex min-w-0 items-center gap-2">
                      <div className="truncate text-sm font-medium">
                        {game.title}
                      </div>
                      {game.edition && (
                        <Badge variant="secondary" className="shrink">
                          <span className="truncate">{game.edition}</span>
                        </Badge>
                      )}
                    </div>
                    <div className="text-muted-foreground text-sm">
                      {game.platform?.name}
                    </div>
                  </div>
                </div>

                <div className="flex w-full flex-col overflow-hidden md:items-end">
                  <Stars activeStar={game.rating ? game.rating - 1 : 0} />
                </div>

                <div className="flex w-full justify-between gap-2 overflow-hidden md:flex-col">
                  {game.completed ? (
                    <div className="text-muted-foreground flex min-w-px flex-col gap-1 overflow-hidden text-sm">
                      <div className="-ml-[3px] flex items-center gap-1">
                        <span className="flex size-4 shrink-0 items-center justify-center">
                          <span className="size-2 flex-none rounded-full bg-green-400" />
                        </span>
                        <span className="truncate">Completed</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-muted-foreground -ml-[3px] flex items-center gap-1 text-sm">
                      <span className="flex size-4 shrink-0 items-center justify-center">
                        <span className="size-2 flex-none rounded-full bg-neutral-400" />
                      </span>
                      <span className="truncate">Backlog</span>
                    </div>
                  )}
                  {game.completed && game.completedDate && (
                    <span className="text-muted-foreground truncate text-sm">
                      {" "}
                      {game.completedDate.toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
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
    </div>
  );
}
