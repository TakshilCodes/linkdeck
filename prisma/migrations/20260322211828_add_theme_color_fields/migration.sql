/*
  Warnings:

  - You are about to drop the column `gradientFrom` on the `DefaultTheme` table. All the data in the column will be lost.
  - You are about to drop the column `gradientTo` on the `DefaultTheme` table. All the data in the column will be lost.
  - You are about to drop the column `gradientFrom` on the `UserCustomization` table. All the data in the column will be lost.
  - You are about to drop the column `gradientTo` on the `UserCustomization` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DefaultTheme" DROP COLUMN "gradientFrom",
DROP COLUMN "gradientTo",
ADD COLUMN     "backgroundColor2" TEXT,
ADD COLUMN     "outlineColor" TEXT,
ADD COLUMN     "patternColor" TEXT,
ADD COLUMN     "previewImgUrl" TEXT,
ADD COLUMN     "shadowColor" TEXT;

-- AlterTable
ALTER TABLE "UserCustomization" DROP COLUMN "gradientFrom",
DROP COLUMN "gradientTo",
ADD COLUMN     "backgroundColor2" TEXT,
ADD COLUMN     "outlineColor" TEXT,
ADD COLUMN     "patternColor" TEXT,
ADD COLUMN     "shadowColor" TEXT;
