import Image from 'next/image';
import { inferQueryOutput } from '../utils/trpc';
import Badge from './common/Badge';
import Button from './common/Button';
import Table from './common/Table';

interface Props {
  game: inferQueryOutput<'game.by-id'>;
  onClickEdit: () => void;
}

const GameDetails: React.FC<Props> = ({ game, onClickEdit }) => {
  if (!game) return null;

  const {
    title,
    cover,
    platform,
    edition,
    completedDate,
    inCollection,
    completed,
  } = game;

  const completedText = completed
    ? `Yes (${completedDate?.toLocaleDateString()})`
    : 'No';
  return (
    <div>
      <div className="flex flex-col gap-3 pb-6 sm:flex-row sm:items-center">
        <h2 className="text-3xl font-bold">{title}</h2>
        <div className="flex shrink-0 gap-3">
          {completed && <Badge text="completed" color="blue" />}
          {inCollection && <Badge text="in collection" color="green" />}
        </div>
      </div>

      <div className="flex w-full max-w-xl flex-col items-center justify-center gap-6 pb-6 sm:flex-row sm:items-start sm:justify-start">
        <div className="relative h-48 w-48">
          <Image
            alt={`${title} cover`}
            src={cover?.secureUrl || '/image-placeholder.jpeg'}
            layout="fill"
            objectFit="contain"
            objectPosition={'50% 0%'}
          />
        </div>

        <Table
          rows={[
            { title: 'Platform', content: platform?.name },
            { title: 'Edition', content: edition },
            {
              title: 'Completed',
              content: completedText,
            },
            {
              title: 'In collection',
              content: inCollection ? 'Yes' : 'No',
            },
          ]}
        />
      </div>
      <Button onClick={onClickEdit}>Edit</Button>
    </div>
  );
};

export default GameDetails;
