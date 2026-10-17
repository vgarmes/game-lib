"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { SnippetCard } from "./snippet-card";

const SLIDE_DURATION_MS = 5000;

export interface RecentlyBoughtGame {
  id: number;
  title: string;
  buyDate: Date | null;
  platform: { name: string } | null;
  cover: { secureUrl: string; width: number; height: number } | null;
}

interface Props {
  games: RecentlyBoughtGame[];
}

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  day: "numeric",
  month: "short",
  year: "numeric",
  // buyDate is a plain DB date stored as UTC midnight
  timeZone: "UTC",
});

// Camera-roll style carousel of the most recently bought games.
export function RecentlyBoughtCard({ games }: Props) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  const goTo = useCallback((index: number, smooth = true) => {
    const scrollArea = scrollAreaRef.current;
    const slide = slideRefs.current[index];
    if (!scrollArea || !slide) return;
    scrollArea.scrollTo({
      left: slide.offsetLeft,
      behavior: smooth ? "smooth" : "auto",
    });
  }, []);

  // Track the visible slide so swiping updates the indicator.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(
              slideRefs.current.indexOf(entry.target as HTMLDivElement),
            );
          }
        }
      },
      { root: scrollAreaRef.current, threshold: 0.6 },
    );
    for (const slide of slideRefs.current) {
      if (slide) observer.observe(slide);
    }
    return () => observer.disconnect();
  }, [games]);

  // Autoplay; restarts whenever the active slide changes (including swipes).
  useEffect(() => {
    if (paused || games.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timeout = setTimeout(() => {
      const next = (active + 1) % games.length;
      goTo(next, next !== 0);
    }, SLIDE_DURATION_MS);
    return () => clearTimeout(timeout);
  }, [active, paused, games.length, goTo]);

  if (games.length === 0) {
    return (
      <SnippetCard title="Recently bought">
        <p className="text-muted-foreground text-sm">No purchases yet.</p>
      </SnippetCard>
    );
  }

  return (
    <SnippetCard
      title="Recently bought"
      action={
        games.length > 1 && (
          <div className="flex items-center gap-1.5">
            {games.map((game, i) => (
              <button
                key={game.id}
                type="button"
                aria-label={`Go to ${game.title}`}
                aria-current={i === active}
                onClick={() => goTo(i)}
                className={cn(
                  "rounded-full transition-all duration-150",
                  i === active
                    ? "bg-primary h-1.5 w-6"
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50 size-2",
                )}
              />
            ))}
          </div>
        )
      }
    >
      <div
        ref={scrollAreaRef}
        className="no-scrollbar relative flex aspect-3/4 w-full snap-x snap-mandatory gap-4 overflow-x-auto rounded-lg"
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        {games.map((game, i) => (
          <div
            key={game.id}
            ref={(el) => {
              slideRefs.current[i] = el;
            }}
            className="bg-muted relative h-full w-full shrink-0 snap-start overflow-hidden rounded-lg"
          >
            {game.cover && (
              <>
                <Image
                  alt=""
                  src={game.cover.secureUrl}
                  fill
                  className="pointer-events-none scale-110 object-cover opacity-40 blur-xl"
                />
                <Image
                  alt={`${game.title} cover`}
                  src={game.cover.secureUrl}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  className="object-contain p-6 pb-20 drop-shadow-xl"
                />
              </>
            )}
            <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 to-transparent p-4 pt-12 text-white">
              <p className="line-clamp-2 font-medium tracking-tight">
                {game.title}
              </p>
              <p className="text-xs text-white/70">
                {[
                  game.platform?.name,
                  game.buyDate && dateFormatter.format(game.buyDate),
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            </div>
          </div>
        ))}
      </div>
    </SnippetCard>
  );
}
