/*
  Warnings:

  - You are about to drop the column `themeId` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "OnboardingStep" AS ENUM ('USERNAME', 'THEME', 'PLATFORMS', 'LINKS', 'PROFILE', 'DONE');

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_themeId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "themeId",
ADD COLUMN     "defaultThemeId" TEXT,
ADD COLUMN     "onboardingDone" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "onboardingStep" "OnboardingStep" NOT NULL DEFAULT 'USERNAME';

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_defaultThemeId_fkey" FOREIGN KEY ("defaultThemeId") REFERENCES "DefaultTheme"("id") ON DELETE SET NULL ON UPDATE CASCADE;
