/*
  Warnings:

  - The `blurStrength` column on the `DefaultTheme` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `fontFamily` column on the `DefaultTheme` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `titleFontSize` column on the `DefaultTheme` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `titleFontWeight` column on the `DefaultTheme` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `profileFontSize` column on the `DefaultTheme` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `blurStrength` column on the `UserCustomization` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `fontFamily` column on the `UserCustomization` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `titleFontSize` column on the `UserCustomization` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `titleFontWeight` column on the `UserCustomization` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `profileFontSize` column on the `UserCustomization` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "titleFontSize" AS ENUM ('SMALL', 'MEDIUM', 'LARGE');

-- CreateEnum
CREATE TYPE "profileFontSize" AS ENUM ('SMALL', 'MEDIUM', 'LARGE');

-- CreateEnum
CREATE TYPE "titleFontWeight" AS ENUM ('NONE', 'SOFT', 'MEDIUM', 'STRONG');

-- CreateEnum
CREATE TYPE "BlurStrength" AS ENUM ('NONE', 'SOFT', 'MEDIUM', 'STRONG');

-- CreateEnum
CREATE TYPE "FontFamily" AS ENUM ('INTER', 'POPPINS', 'MONTSERRAT', 'ROBOTO', 'PLAYFAIR', 'OUTFIT');

-- AlterTable
ALTER TABLE "DefaultTheme" DROP COLUMN "blurStrength",
ADD COLUMN     "blurStrength" "BlurStrength",
DROP COLUMN "fontFamily",
ADD COLUMN     "fontFamily" "FontFamily",
DROP COLUMN "titleFontSize",
ADD COLUMN     "titleFontSize" "titleFontSize",
DROP COLUMN "titleFontWeight",
ADD COLUMN     "titleFontWeight" "titleFontWeight",
DROP COLUMN "profileFontSize",
ADD COLUMN     "profileFontSize" "profileFontSize";

-- AlterTable
ALTER TABLE "UserCustomization" DROP COLUMN "blurStrength",
ADD COLUMN     "blurStrength" "BlurStrength",
DROP COLUMN "fontFamily",
ADD COLUMN     "fontFamily" "FontFamily",
DROP COLUMN "titleFontSize",
ADD COLUMN     "titleFontSize" "titleFontSize",
DROP COLUMN "titleFontWeight",
ADD COLUMN     "titleFontWeight" "titleFontWeight",
DROP COLUMN "profileFontSize",
ADD COLUMN     "profileFontSize" "profileFontSize";

-- CreateIndex
CREATE INDEX "Collection_userId_position_idx" ON "Collection"("userId", "position");

-- CreateIndex
CREATE INDEX "Link_userId_position_idx" ON "Link"("userId", "position");

-- CreateIndex
CREATE INDEX "SocialIcon_userId_position_idx" ON "SocialIcon"("userId", "position");
