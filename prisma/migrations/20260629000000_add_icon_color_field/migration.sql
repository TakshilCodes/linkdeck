-- Add a dedicated social icon color override for profile themes.
ALTER TABLE "DefaultTheme" ADD COLUMN     "iconColor" TEXT;

ALTER TABLE "UserCustomization" ADD COLUMN     "iconColor" TEXT;
