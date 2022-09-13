/* eslint-disable */
import { config } from 'dotenv';
import { PrismaClient } from '@prisma/client';
import games from '../data/games.json';
import platforms from '../data/platforms.json';
import blobs from '../data/active_storage_blobs.json';
import attachments from '../data/active_storage_attachments.json';
import images from '../data/cloudinary_images.json';
import { Cover } from '@prisma/client';

/* 
Code used to migrate from old database into the local dev database in order to generate a dump file with the new schema.

It can also be used to seed the dev database.

To restore the production database, first dump the local database:
pg_dump -U <username> -h <host> -p <port> -W -F t <db_name> > <output_filename>

Then restore the data to the production database, with the --data-only flag
(schema in production should already be in place before running this)
pg_restore -U <username> -h <host> -p <port> -W -F t -d <db_name> --data-only --table=<table> <input_filename>
*/

const prisma = new PrismaClient();

const migrateGames = async () => {
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

const migratePlatforms = async () => {
  return prisma.platform.createMany({
    data: platforms.map(
      ({ created_at, updated_at, ...keepAttrs }) => keepAttrs
    ),
  });
};

const migrateImages = async () => {
  const covers: Omit<Cover, 'id' | 'createdAt' | 'updatedAt'>[] = [];

  images.forEach((image) => {
    const blob = blobs.find((blob) => image.public_id === `games/${blob.key}`);
    if (!blob)
      return console.log(`resource ${image.public_id}: blob not found`);

    const attachment = attachments.find((att) => att.blob_id === blob.id);
    if (!attachment)
      return console.log(`resource ${image.public_id}: attachment not found`);

    covers.push({
      publicId: image.public_id,
      secureUrl: image.secure_url,
      filename: blob.filename,
      format: image.format,
      byteSize: image.bytes,
      checksum: blob.checksum,
      gameId: attachment.record_id,
    });
  });

  return prisma.cover.createMany({
    data: covers,
  });
};

const main = async () => {
  config();
  migratePlatforms();
  migrateGames().then(() => migrateImages());
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
