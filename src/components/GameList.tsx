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
    <div>
      {games.map((game) => (
        <div key={game.id}>
          <h1>{game.title}</h1>

          {game.cover && (
            <div
              style={{ position: 'relative', width: '200px', height: '200px' }}
            >
              <Image
                alt={`${game.title} cover`}
                src={game.cover.secureUrl}
                placeholder="blur"
                layout="fill"
                objectFit="contain"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default GameList;
