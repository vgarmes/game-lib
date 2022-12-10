import { Dialog, Transition } from '@headlessui/react';
import type { Game } from './GameList';
import { Fragment } from 'react';
import GameThumbnail from './GameThumbnail';
import Image from 'next/image';
import { Stars } from './common';
import Link from 'next/link';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  game: Game | null;
}

const GameDialog: React.FC<Props> = ({ isOpen, onClose, game }) => {
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
            enterTo=""
            leave="ease-in duration-200"
            leaveFrom="translate-y-0"
            leaveTo="translate-y-full"
          >
            <Dialog.Panel className="relative w-full overflow-hidden rounded-t-lg text-white">
              {game?.cover?.secureUrl && (
                <Image
                  alt="background"
                  src={game.cover.secureUrl}
                  layout="fill"
                  objectFit="cover"
                  className=""
                />
              )}

              <div className="flex items-center gap-3 p-4 backdrop-blur backdrop-brightness-50 sm:p-10">
                <GameThumbnail
                  title={game?.title}
                  src={game?.cover?.secureUrl ?? undefined}
                />
                <div className="grow">
                  <Dialog.Title className="pb-1 text-xl font-semibold uppercase">
                    {game?.title}
                  </Dialog.Title>
                  <div className="flex items-center gap-1">
                    <Stars activeStar={game?.rating} />
                    {!game?.rating && (
                      <p className="text-xs text-gray-300">(not rated)</p>
                    )}
                  </div>
                  <div className="py-2">
                    <p className="text-xs uppercase text-gray-300">Completed</p>
                    <p className="text-sm font-semibold">
                      {game?.completed
                        ? game?.completedDate?.toDateString()
                        : 'Not completed'}
                    </p>
                  </div>
                  <Link href={`/games/${game?.id}`} passHref>
                    <a className="text-sm font-bold underline">See details</a>
                  </Link>
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
