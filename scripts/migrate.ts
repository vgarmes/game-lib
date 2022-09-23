/* eslint-disable */
import { config } from 'dotenv';
import { PrismaClient } from '@prisma/client';
import games from '../data/games.json';
import platforms from '../data/platforms.json';
import blobs from '../data/active_storage_blobs.json';
import attachments from '../data/active_storage_attachments.json';
import images from '../data/cloudinary_images.json';

/* 
Code used to migrate from old database into the local dev database in order to generate a dump file with the new schema.

It can also be used to seed the dev database.

To restore the production database, first dump the local database:
pg_dump -U <username> -h <host> -p <port> -W -F t --no-owner --no-privileges <db_name> > <output_filename>

Then restore the data to the production database, with the --data-only flag
(schema in production should already be in place before running this)
pg_restore -U <username> -h <host> -p <port> -W -d <db_name> --clean <input_filename>
*/

const prisma = new PrismaClient();

const getCoverData = (gameId: number) => {
  const attachment = attachments.find((att) => att.record_id === gameId);
  const blob = blobs.find((blob) => blob.id === attachment?.blob_id);
  const image = images.find(
    (image) => image.public_id === `games/${blob?.key}`
  );
  if (!attachment || !blob || !image) {
    return;
  }
  return {
    publicId: image.public_id,
    secureUrl: image.secure_url,
    filename: blob.filename,
    format: image.format,
    byteSize: image.bytes,
    width: image.width,
    height: image.height,
    checksum: blob.checksum,
  };
};

const migrateGames = async () => {
  // inserting data with the old id's will create sync issues with the autoincrement() function in PostgreSQL.
  // therefore we need to remap the id's to the new ones.
  const newPlatforms = await prisma.platform.findMany();

  return Promise.all(
    games.map(
      async ({
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
      }) => {
        const platformName = platforms.find(
          (platform) => platform.id === platform_id
        )?.name;
        const platformId = newPlatforms.find(
          (platform) => platform.name === platformName
        )?.id;
        const coverData = getCoverData(id);
        console.log('Inserting game: ', title);

        return prisma.game.create({
          data: {
            title,
            inCollection: in_collection,
            completed,
            edition,
            releaseDate: release_date ? new Date(release_date) : undefined,
            completedDate: completed_date
              ? new Date(completed_date)
              : undefined,
            buyDate: buy_date ? new Date(buy_date) : undefined,
            buyPrice: buy_price,
            rating,
            comment,
            platform: {
              connect: { id: platformId },
            },
            cover: {
              create: coverData,
            },
          },
        });
      }
    )
  );
};

const migratePlatforms = async () => {
  return prisma.platform.createMany({
    data: platforms.map(
      ({ id, created_at, updated_at, ...keepAttrs }) => keepAttrs
    ),
  });
};

const main = async () => {
  config();
  await migratePlatforms();
  await migrateGames();
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
