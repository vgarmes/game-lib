"use client";

import { trpc } from "@/trpc/client";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { PageLayout } from "@/components/page-layout";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
  formatDistance,
  formatDistanceToNow,
  formatDistanceToNowStrict,
} from "date-fns";
import { Stars } from "@/components/common";

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "long",
});

export default function GamesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
    trpc.game.search.useInfiniteQuery(
      { limit: 50, query: searchQuery },
      {
        getNextPageParam: (lastPage) => lastPage.nextPage,
        initialCursor: 0,
      },
    );

  const flatData = data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <PageLayout breadcrumbs={undefined}>
      <div className="flex flex-col gap-4 px-4 pb-4 lg:px-6">
        <Input
          className="h-10"
          placeholder="Search games..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="flex flex-col gap-2 md:gap-0">
          {flatData.map((game) => (
            <div
              key={game.id}
              className="bg-card/50 flex flex-col gap-4 overflow-hidden rounded-lg border p-4 md:flex-row md:gap-8 md:rounded-none md:not-last:border-b-0 md:first:rounded-t-lg md:last:rounded-b-lg"
            >
              <div className="flex min-w-80 flex-1 items-center gap-4 overflow-hidden">
                <div className="relative size-12 shrink-0 overflow-hidden rounded">
                  <Image
                    alt={game.title}
                    src={game.cover?.secureUrl ?? "/placeholder.png"}
                    fill
                    className="size-4 rounded object-cover"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <div className="truncate text-sm font-medium">
                      {game.title}
                    </div>
                    {game.edition && (
                      <Badge variant="secondary">{game.edition}</Badge>
                    )}
                  </div>
                  <div className="text-muted-foreground text-sm">
                    {game.platform?.name}
                  </div>
                </div>
              </div>

              <div className="flex max-w-40 flex-1 flex-col">
                <Stars activeStar={game.rating ? game.rating - 1 : 0} />
              </div>

              <div className="flex max-w-30 flex-[1_1_auto] flex-col gap-2 overflow-hidden">
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
    </PageLayout>
  );
}
