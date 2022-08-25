import { Game } from '@prisma/client';
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
          <img alt={game.title || undefined} src={game.cover?.secureUrl} />
        </div>
      ))}
    </div>
  );
};

export default GameList;
