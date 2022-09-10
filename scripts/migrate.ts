/* eslint-disable */
import { config } from 'dotenv';
import { prisma } from '../src/server/prisma';
import games from '../data/games.json';
import platforms from '../data/platforms.json';
import blobs from '../data/active_storage_blobs.json';
import attachments from '../data/active_storage_attachments.json';
import images from '../data/cloudinary_images.json';
import { Cover } from '@prisma/client';
import { CloudinaryImage } from '../src/utils/cloudinary';
import { getImages } from './cloudinary';
import fs from 'fs';
import path from 'path';

/* 
Code used to migrate from old database into the local dev database to generate a dump file with the new schema

To restore the production database, first dump the local database:
pg_dump -U <username> -h <host> -p <port> -W -F t <db_name> > <output_filename>

Then restore the data to the production database, with the --data-only flag
(schema in production should already be in place before running this)
pg_restore -U <username> -h <host> -p <port> -W -F t -d <db_name> --data-only --table=<table> <input_filename>
*/

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

export const getAllImages = async (save?: boolean) => {
  const MAX_ITER = 10;
  const resources: CloudinaryImage[] = [];

  console.log('Getting images data from Cloudinary...');
  const data = await getImages();
  let nextCursor = data.next_cursor;
  resources.push(...data.resources);

  let iter = 0;
  while (iter < MAX_ITER && nextCursor) {
    console.log('Iteration ', iter);
    const data = await getImages(nextCursor);
    resources.push(...data.resources);
    nextCursor = data.next_cursor;
    iter++;
  }

  console.log('Done!');

  if (save) {
    const filePath = path.join(process.cwd(), 'data', 'cloudinary_images.json');

    fs.writeFile(filePath, JSON.stringify(resources), (error) => {
      if (error) {
        console.log(error);
      } else {
        console.log(`Data saved successfully to ${filePath}`);
      }
    });
  }

  return resources;
};

const migrateImages = async () => {
  const covers: Omit<Cover, 'id' | 'createdAt' | 'updatedAt' | 'metadata'>[] =
    [];

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
  seedPlatforms();
  seedGames();
  migrateImages();
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
