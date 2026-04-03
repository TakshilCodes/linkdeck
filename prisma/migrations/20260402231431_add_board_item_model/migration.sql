/*
  Warnings:

  - You are about to drop the column `lockToSubscribers` on the `Link` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "BoardItemType" AS ENUM ('LINK', 'COLLECTION');

-- AlterTable
ALTER TABLE "Link" DROP COLUMN "lockToSubscribers";

-- CreateTable
CREATE TABLE "BoardItem" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "BoardItemType" NOT NULL,
    "position" INTEGER NOT NULL,
    "linkId" TEXT,
    "collectionId" TEXT,

    CONSTRAINT "BoardItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BoardItem_linkId_key" ON "BoardItem"("linkId");

-- CreateIndex
CREATE UNIQUE INDEX "BoardItem_collectionId_key" ON "BoardItem"("collectionId");

-- CreateIndex
CREATE INDEX "BoardItem_userId_position_idx" ON "BoardItem"("userId", "position");

-- AddForeignKey
ALTER TABLE "BoardItem" ADD CONSTRAINT "BoardItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoardItem" ADD CONSTRAINT "BoardItem_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "Link"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoardItem" ADD CONSTRAINT "BoardItem_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
