/*
  Warnings:

  - Made the column `backgroundColor` on table `DefaultTheme` required. This step will fail if there are existing NULL values in that column.
  - Made the column `buttonColor` on table `DefaultTheme` required. This step will fail if there are existing NULL values in that column.
  - Made the column `buttonTextColor` on table `DefaultTheme` required. This step will fail if there are existing NULL values in that column.
  - Made the column `titleColor` on table `DefaultTheme` required. This step will fail if there are existing NULL values in that column.
  - Made the column `profileColor` on table `DefaultTheme` required. This step will fail if there are existing NULL values in that column.
  - Made the column `fontFamily` on table `DefaultTheme` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "DefaultTheme" ALTER COLUMN "backgroundColor" SET NOT NULL,
ALTER COLUMN "buttonColor" SET NOT NULL,
ALTER COLUMN "buttonTextColor" SET NOT NULL,
ALTER COLUMN "titleColor" SET NOT NULL,
ALTER COLUMN "profileColor" SET NOT NULL,
ALTER COLUMN "fontFamily" SET NOT NULL;
