import Image from 'next/image';
import { useState } from 'react';
import GameDialog from './GameDialog';
import type { Games, Game } from '@/types/trpc';
import { Skeleton } from './ui/skeleton';

//  <Link key={game.id} href={`/games/${game.id}`} passHref>

interface props {
  games: Games;
  isLoading?: boolean;
  size?: number;
}
const GameList = ({ games, isLoading, size = 100 }: props) => {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  if (isLoading) {
    return (
      <div className="grid grid-cols-[repeat(auto-fill,_minmax(10rem,_1fr))] justify-items-center gap-6">
        {Array.from({ length: size }, (_, index) => (
          <div key={index} className="w-28 flex flex-col gap-3 items-center">
            <Skeleton className="h-28 w-5/6 rounded" />
            <Skeleton className="rounded-full w-full h-3" />
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-[repeat(auto-fill,_minmax(10rem,_1fr))] justify-items-center gap-6">
      {games.map((game) => {
        const hasCover = Boolean(game.cover?.secureUrl);
        return (
          <div
            key={game.id}
            className="group flex cursor-pointer flex-col items-center"
            onClick={() => setSelectedGame(game)}
          >
            <div className="relative h-28 w-28 transition-transform group-hover:scale-110">
              <Image
                alt={`${game.title} cover`}
                src={game.cover?.secureUrl || '/image-placeholder.jpeg'}
                layout="fill"
                objectFit={hasCover ? 'contain' : 'cover'}
                objectPosition={'50% 50%'}
                className={hasCover ? '' : 'rounded'}
              />
            </div>

            <h1 className="text-center p-3 text-sm font-bold tracking-tight">
              {game.title}
            </h1>
          </div>
        );
      })}
      <GameDialog
        game={selectedGame}
        isOpen={Boolean(selectedGame)}
        onClose={() => setSelectedGame(null)}
      />
    </div>
  );
};

export default GameList;
