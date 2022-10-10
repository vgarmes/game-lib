import { inferQueryOutput } from '../utils/trpc';

const GameDetails = (props: inferQueryOutput<'game.by-id'>) => {
  if (!props) {
    return null;
  }

  const { title } = props;
  return (
    <div>
      <p>{title}</p>
    </div>
  );
};

export default GameDetails;
