import Image from 'next/image';
import { useState } from 'react';
import GameDialog from './GameDialog';
import type { Games, Game } from '@/types/trpc';
import { ImageIcon } from 'lucide-react';

interface props {
  games: Games;
}
const GameList = ({ games }: props) => {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  return (
    <div className="grid grid-cols-[repeat(auto-fill,_minmax(8rem,_1fr))] md:grid-cols-[repeat(auto-fill,_minmax(10rem,_1fr))] justify-items-center">
      {games.map((game) => {
        return (
          <div
            key={game.id}
            className="group flex cursor-pointer flex-col items-center mb-6"
            onClick={() => setSelectedGame(game)}
          >
            <div className="relative h-28 w-28 transition-transform group-hover:scale-110">
              {game.cover?.secureUrl ? (
                <Image
                  alt={`${game.title} cover`}
                  src={game.cover.secureUrl}
                  fill={true}
                  style={{
                    objectFit: 'contain',
                    objectPosition: '50% 50%',
                  }}
                  className="rounded"
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-zinc-100 dark:bg-zinc-900 rounded">
                  <ImageIcon />
                </div>
              )}
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
