-- CreateEnum
CREATE TYPE "GameStatus" AS ENUM ('backlog', 'in_progress', 'completed');

-- AddColumn
ALTER TABLE "Game" ADD COLUMN "status" "GameStatus" NOT NULL DEFAULT 'backlog';

-- Backfill from the old boolean flag
UPDATE "Game" SET "status" = 'completed' WHERE "completed" = true;

-- Swap index; drop the unused developer index
DROP INDEX IF EXISTS "Game_completed_completedDate_idx";
DROP INDEX IF EXISTS "Game_developerId_title_idx";
CREATE INDEX "Game_status_completedDate_idx" ON "Game"("status", "completedDate" DESC);

-- DropColumn
ALTER TABLE "Game" DROP COLUMN "completed";
