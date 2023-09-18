import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import GameDialog from './GameDialog';
import { RouterOutput } from '@/types/trpc';

//  <Link key={game.id} href={`/games/${game.id}`} passHref>
type Games = RouterOutput['game']['search'];
type Game = Games[number];

interface props {
  games: Games;
}
const GameList = ({ games }: props) => {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  return (
    <div className="grid grid-cols-[repeat(auto-fill,_minmax(10rem,_1fr))] justify-items-center">
      {games.map((game) => {
        const hasCover = Boolean(game.cover?.secureUrl);
        return (
          <div
            key={game.id}
            className="group flex w-40 cursor-pointer flex-col items-center"
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
            <div className="p-3">
              <h1 className="text-center text-sm font-bold tracking-tight">
                {game.title}
              </h1>
            </div>
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
