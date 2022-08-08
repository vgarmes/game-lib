import { prisma } from '../src/server/prisma';
import games from '../data/games.json';
import platforms from '../data/platforms.json';
import blobs from '../data/active_storage_blobs.json';
import attachments from '../data/active_storage_attachments.json';
import { Cover, Game } from '@prisma/client';

interface GameRaw {}

const seedGames = async () => {
  const cleanData = games.map(
    ({
      id,
      title,
      in_collection,
      completed,
      edition,
      release_date,
      completed_date,
      buy_date,
      buy_price,
      rating,
      comment,
      platform_id,
    }) => ({
      id,
      title,
      inCollection: in_collection,
      completed,
      edition,
      releaseDate: release_date && new Date(release_date),
      completedDate: completed_date && new Date(completed_date),
      buyDate: buy_date && new Date(buy_date),
      buyPrice: buy_price,
      rating,
      comment,
      platformId: platform_id,
    })
  );
  return prisma.game.createMany({
    data: cleanData,
  });
};

const seedPlatforms = async () => {
  return prisma.platform.createMany({
    data: platforms.map(
      ({ created_at, updated_at, ...keepAttrs }) => keepAttrs
    ),
  });
};

const seedImages = async () => {
  const covers: Omit<Cover, 'createdAt' | 'updatedAt' | 'metadata'>[] = [];
  const data = attachments.forEach((attachment) => {
    const blob = blobs.find((blob) => attachment.blob_id === blob.id);
    if (!blob) return;

    const { key, filename, content_type, metadata, byte_size, checksum } = blob;
    covers.push({
      id: attachment.id,
      key,
      filename,
      contentType: content_type,
      byteSize: byte_size,
      checksum,
      gameId: attachment.record_id,
    });
  });
  return prisma.cover.createMany({
    data: covers,
  });
};

const main = async () => {
  //seedPlatforms();
  //seedGames();
  seedImages();
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
