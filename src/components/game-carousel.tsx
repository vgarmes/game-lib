import type { Game } from "@/types/trpc";
import { GameThumbnail } from "./game-thumbnail";

interface Props {
  games: Game[];
}

export const GameCarousel: React.FC<Props> = ({ games }) => {
  return (
    <div className="relative">
      <div className="no-scrollbar flex flex-nowrap items-stretch gap-2 overflow-x-auto px-4 py-2 pr-4 lg:px-6">
        {games.map((game) => {
          return <GameThumbnail key={game.id} game={game} />;
        })}
      </div>
      <div className="from-background absolute top-0 bottom-0 left-0 w-4 bg-linear-to-r to-transparent lg:w-6" />
      <div className="to-background absolute top-0 right-0 bottom-0 w-4 bg-linear-to-r from-transparent lg:w-6" />
    </div>
  );
};
