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
        <div className="rounded-lg border">
          {flatData.map((game) => (
            <div
              key={game.id}
              className="flex items-start gap-4 p-4 not-last:border-b"
            >
              <div className="relative size-12 overflow-hidden rounded">
                <Image
                  alt={game.title}
                  src={game.cover?.secureUrl ?? "/placeholder.png"}
                  fill
                  className="size-4 rounded object-cover"
                />
              </div>

              <div className="flex max-w-80 flex-1 flex-col gap-1">
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

              <div className="flex flex-col gap-1">
                {game.completed ? (
                  <div className="text-muted-foreground flex flex-col gap-1 text-sm">
                    <div className="-ml-[3px] flex items-center gap-1">
                      <span className="flex size-4 items-center justify-center">
                        <span className="size-2 flex-none rounded-full bg-green-400" />
                      </span>
                      Completed
                      {game.completedDate && (
                        <span>
                          {" "}
                          {formatDistanceToNowStrict(game.completedDate, {
                            addSuffix: true,
                          })}
                        </span>
                      )}
                    </div>

                    {game.completedDate && (
                      <div>
                        <span>{dateFormatter.format(game.completedDate)}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-muted-foreground -ml-[3px] flex items-center gap-1 text-sm">
                    <span className="flex size-4 items-center justify-center">
                      <span className="size-2 flex-none rounded-full bg-neutral-400" />
                    </span>
                    Not Completed
                  </div>
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
