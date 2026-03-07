import GameList from '@/components/GameList';
import { trpc } from '@/trpc/server';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  if (!q) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        Enter a search term
      </div>
    );
  }

  const games = await trpc.game.search({ query: q, skip: 0 });

  if (games.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        No results for &ldquo;{q}&rdquo;
      </div>
    );
  }

  return <GameList games={games} />;
}
