-- CreateEnum
CREATE TYPE "IconType" AS ENUM ('INSTAGRAM', 'X', 'LINKEDIN', 'FACEBOOK', 'YOUTUBE', 'GITHUB', 'PERSONAL_WEBSITE', 'PATREON', 'KICK', 'DISCORD', 'PINTEREST', 'TWITCH', 'TELEGRAM', 'THREADS', 'SNAPCHAT');

-- CreateEnum
CREATE TYPE "WallpaperStyle" AS ENUM ('FILL', 'GRADIENT', 'BLUR', 'PATTERN');

-- CreateEnum
CREATE TYPE "GradientDirection" AS ENUM ('LINEAR_UP', 'LINEAR_DOWN', 'RADIAL');

-- CreateEnum
CREATE TYPE "PatternStyle" AS ENUM ('GRID', 'MORPH', 'ORGANIC', 'MATRIX');

-- CreateEnum
CREATE TYPE "ButtonStyle" AS ENUM ('SOLID', 'GLASS', 'OUTLINE');

-- CreateEnum
CREATE TYPE "ButtonRadius" AS ENUM ('SQUARE', 'ROUND', 'ROUNDER', 'FULL');

-- CreateEnum
CREATE TYPE "ButtonShadow" AS ENUM ('NONE', 'SOFT', 'STRONG', 'HARD');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "displayName" TEXT,
    "profileImgUrl" TEXT,
    "bio" TEXT,
    "hashedPassword" TEXT,
    "themeId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Link" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "collectionId" TEXT,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "lockToSubscribers" BOOLEAN NOT NULL DEFAULT false,
    "isSensitive" BOOLEAN NOT NULL DEFAULT false,
    "clickCount" INTEGER NOT NULL DEFAULT 0,
    "position" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Link_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Collection" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "position" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Collection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialIcon" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "IconType" NOT NULL,
    "url" TEXT NOT NULL,
    "label" TEXT,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "position" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SocialIcon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DefaultTheme" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "wallpaperStyle" "WallpaperStyle" NOT NULL,
    "backgroundColor" TEXT,
    "gradientFrom" TEXT,
    "gradientTo" TEXT,
    "gradientDirection" "GradientDirection",
    "patternStyle" "PatternStyle",
    "blurStrength" TEXT,
    "fontFamily" TEXT,
    "buttonStyle" "ButtonStyle" NOT NULL,
    "buttonRadius" "ButtonRadius" NOT NULL,
    "buttonShadow" "ButtonShadow" NOT NULL,
    "buttonColor" TEXT,
    "buttonTextColor" TEXT,
    "titleFontSize" TEXT,
    "titleColor" TEXT,
    "titleFontWeight" TEXT,
    "profileFontSize" TEXT,
    "profileColor" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DefaultTheme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserCustomization" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "wallpaperStyle" "WallpaperStyle",
    "backgroundColor" TEXT,
    "gradientFrom" TEXT,
    "gradientTo" TEXT,
    "gradientDirection" "GradientDirection",
    "patternStyle" "PatternStyle",
    "blurStrength" TEXT,
    "fontFamily" TEXT,
    "buttonStyle" "ButtonStyle",
    "buttonRadius" "ButtonRadius",
    "buttonShadow" "ButtonShadow",
    "buttonColor" TEXT,
    "buttonTextColor" TEXT,
    "titleFontSize" TEXT,
    "titleColor" TEXT,
    "titleFontWeight" TEXT,
    "profileFontSize" TEXT,
    "profileColor" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserCustomization_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "DefaultTheme_slug_key" ON "DefaultTheme"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "UserCustomization_userId_key" ON "UserCustomization"("userId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_themeId_fkey" FOREIGN KEY ("themeId") REFERENCES "DefaultTheme"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collection" ADD CONSTRAINT "Collection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialIcon" ADD CONSTRAINT "SocialIcon_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCustomization" ADD CONSTRAINT "UserCustomization_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
