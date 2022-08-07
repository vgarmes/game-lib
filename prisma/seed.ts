import { prisma } from '../src/server/prisma';
import games from '../data/games.json';
import platforms from '../data/platforms.json';

interface GameRaw {}

const seedGames = async () => {
  const cleanData = games.map(
    ({
      genre_id,
      created_at,
      updated_at,
      release_date,
      buy_date,
      completed_date,
      ...keepAttrs
    }) => ({
      ...keepAttrs,
      release_date: release_date && new Date(release_date),
      buy_date: buy_date && new Date(buy_date),
      completed_date: completed_date && new Date(completed_date),
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

const main = async () => {
  seedPlatforms();
  //seedGames();
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
