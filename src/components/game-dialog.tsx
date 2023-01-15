import { Dialog, Transition } from '@headlessui/react';
import type { Game } from './game-list';
import { Fragment } from 'react';
import GameThumbnail from './GameThumbnail';
import Image from 'next/image';
import { Badge, Stars } from './common';
import Link from 'next/link';
import { getButtonClassnames } from './common/Button';
import { useSession } from 'next-auth/react';
import Icon from './icon';

interface StatProps {
  title: string;
  content: string;
}

const Stat: React.FC<StatProps> = ({ title, content }) => {
  return (
    <div>
      <p className="text-xs uppercase text-gray-300">{title}</p>
      <p className="text-sm font-semibold">{content}</p>
    </div>
  );
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  game: Game | null;
}

const intl = new Intl.DateTimeFormat('en-GB', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

const GameDialog: React.FC<Props> = ({ isOpen, onClose, game }) => {
  const { data: session } = useSession();

  if (!game) {
    return null;
  }

  let completedDate = 'Not completed';
  if (game.completed) {
    completedDate = game.completedDate
      ? intl.format(game.completedDate)
      : 'Unknown';
  }
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog open={isOpen} onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60" aria-hidden="true" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-end">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="translate-y-full"
            enterTo="translate-y-0"
            leave="ease-in duration-200"
            leaveFrom="translate-y-0"
            leaveTo="translate-y-full"
          >
            <Dialog.Panel className="w-full overflow-hidden rounded-t-lg text-white">
              {game?.cover?.secureUrl && (
                <Image
                  alt="background"
                  src={game.cover.secureUrl}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-lg"
                />
              )}
              <div className="flex items-center gap-3 p-4 backdrop-blur backdrop-brightness-50 md:gap-6 md:p-10">
                <GameThumbnail
                  title={game?.title}
                  src={game?.cover?.secureUrl ?? undefined}
                />
                <div className="grow">
                  <div className="flex flex-col items-start gap-1 pb-1 md:flex-row md:items-center md:gap-3">
                    <Dialog.Title className="text-base font-semibold uppercase md:text-xl">
                      {game.title}
                    </Dialog.Title>
                    {game.edition && <Badge text={game.edition} color="pink" />}
                  </div>

                  <Dialog.Description className="text-sm text-gray-300">
                    {game.platform?.name || 'No platform'}
                  </Dialog.Description>

                  <div className="flex items-center gap-1">
                    <Stars activeStar={game.rating && game.rating - 1} />
                    {!game?.rating && (
                      <p className="text-xs text-gray-300">(not rated)</p>
                    )}
                  </div>
                  <div className="flex items-end justify-between">
                    <div className="flex flex-col gap-2 py-2 md:flex-row md:gap-5">
                      <Stat title="Completed" content={completedDate} />
                      <Stat
                        title="In collection"
                        content={game.inCollection ? 'Yes' : 'No'}
                      />
                    </div>
                    {session?.user.role === 'ADMIN' && (
                      <Link
                        href={`/games/${game?.id.toString()}/edit`}
                        passHref
                      >
                        <a className={getButtonClassnames('primary', 'solid')}>
                          <Icon name="pencil" className="md:pr-3" />
                          <span>Edit</span>
                        </a>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default GameDialog;
