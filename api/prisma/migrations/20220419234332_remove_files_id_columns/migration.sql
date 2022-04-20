/*
  Warnings:

  - You are about to drop the column `posterId` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `iconId` on the `GameCategory` table. All the data in the column will be lost.
  - You are about to drop the column `avatarId` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Game" DROP COLUMN "posterId";

-- AlterTable
ALTER TABLE "GameCategory" DROP COLUMN "iconId";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "avatarId";
