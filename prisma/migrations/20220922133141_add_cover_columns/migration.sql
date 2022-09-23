/*
  Warnings:

  - A unique constraint covering the columns `[checksum]` on the table `Cover` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Developer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Platform` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `height` to the `Cover` table without a default value. This is not possible if the table is not empty.
  - Added the required column `width` to the `Cover` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `Developer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `title` on table `Game` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `Platform` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Cover" ADD COLUMN     "height" INTEGER NOT NULL,
ADD COLUMN     "width" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Developer" ALTER COLUMN "name" SET NOT NULL;

-- AlterTable
ALTER TABLE "Game" ALTER COLUMN "title" SET NOT NULL;

-- AlterTable
ALTER TABLE "Platform" ALTER COLUMN "name" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Cover_checksum_key" ON "Cover"("checksum");

-- CreateIndex
CREATE UNIQUE INDEX "Developer_name_key" ON "Developer"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Platform_name_key" ON "Platform"("name");
