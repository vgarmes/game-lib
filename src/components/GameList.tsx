import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { inferQueryOutput } from '../utils/trpc';
import GameDialog from './GameDialog';

//  <Link key={game.id} href={`/games/${game.id}`} passHref>
export type Games = inferQueryOutput<'game.search'>;
export type Game = Games[number];

interface props {
  games: Games;
}
const GameList = ({ games }: props) => {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  return (
    <>
      <div className="grid grid-cols-[repeat(auto-fill,_minmax(10rem,_1fr))] justify-items-center">
        {games.map((game) => (
          <div
            key={game.id}
            className="group flex w-40 cursor-pointer flex-col items-center"
            onClick={() => {
              setSelectedGame(game);
              setIsDialogOpen(true);
            }}
          >
            {game.cover?.secureUrl && (
              <div className="relative h-28 w-28 transition-transform group-hover:scale-110">
                <Image
                  alt={`${game.title} cover`}
                  src={game.cover.secureUrl}
                  layout="fill"
                  objectFit="contain"
                  objectPosition={'50% 50%'}
                />
              </div>
            )}
            <div className="p-3">
              <h1 className="text-center text-sm font-bold tracking-tight">
                {game.title}
              </h1>
            </div>
          </div>
        ))}
      </div>
      <GameDialog
        game={selectedGame}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </>
  );
};

export default GameList;
