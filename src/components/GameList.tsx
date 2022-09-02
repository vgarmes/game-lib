import { Game } from '@prisma/client';
import Image from 'next/image';
import { inferQueryOutput } from '../utils/trpc';

interface props {
  games?: inferQueryOutput<'game.all'>;
}
const GameList = ({ games }: props) => {
  if (!games) {
    return <div>loading...</div>;
  }
  return (
    <div className="grid grid-cols-[repeat(auto-fill,_minmax(10rem,_1fr))] justify-items-center">
      {games.map((game) => (
        <div key={game.id} className="flex w-40 flex-col items-center">
          {game.cover && (
            <div className="relative h-28 w-28">
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
            <h1 className="text-center text-sm font-bold tracking-tight text-white">
              {game.title}
            </h1>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GameList;
