import Image from 'next/image';
import Link from 'next/link';

type Game = {
  id: number;
  title: string;
  coverUrl: string | null;
};

interface props {
  games: Game[];
}
const GameList = ({ games }: props) => {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,_minmax(10rem,_1fr))] justify-items-center">
      {games.map((game) => (
        <Link key={game.id} href={`/game/${game.id}`} passHref>
          <a>
            <div className="flex w-40 flex-col items-center">
              {game.coverUrl && (
                <div className="relative h-28 w-28">
                  <Image
                    alt={`${game.title} cover`}
                    src={game.coverUrl}
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
          </a>
        </Link>
      ))}
    </div>
  );
};

export default GameList;
