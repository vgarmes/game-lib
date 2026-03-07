import GameDetails from '@/components/GameDetails';
import prisma from '@/server/prisma';
import { notFound } from 'next/navigation';

export default async function GameDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numId = parseInt(id);

  if (isNaN(numId)) {
    return notFound();
  }

  const game = await prisma.game.findFirst({
    where: { id: numId },
    include: {
      cover: { select: { id: true, secureUrl: true } },
      platform: { select: { id: true, name: true } },
    },
  });

  if (!game) {
    return notFound();
  }

  return <GameDetails game={game} />;
}
