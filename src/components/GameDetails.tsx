import { inferQueryOutput } from '../utils/trpc';

interface Props {
  game: inferQueryOutput<'game.by-id'>;
}

const GameDetails: React.FC<Props> = ({ game }) => {
  if (!game) return null;

  const { title } = game;

  return (
    <div>
      <p>{title}</p>
    </div>
  );
};

export default GameDetails;
