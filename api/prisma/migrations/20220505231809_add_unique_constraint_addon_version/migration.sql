/*
  Warnings:

  - You are about to drop the column `fileId` on the `AddonVersion` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[version]` on the table `AddonVersion` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "AddonVersion" DROP COLUMN "fileId";

-- CreateIndex
CREATE UNIQUE INDEX "AddonVersion_version_key" ON "AddonVersion"("version");
