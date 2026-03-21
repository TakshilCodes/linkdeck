/*
  Warnings:

  - Added the required column `authProvider` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "authProvider" AS ENUM ('GOOGLE', 'GITHUB', 'CREDENTIALS');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "authProvider" "authProvider" NOT NULL;
