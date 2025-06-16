-- CreateEnum
CREATE TYPE "category" AS ENUM ('genesis', 'animals', 'abstract', 'futuristic', 'nature', 'space', 'mythical');

-- AlterTable
ALTER TABLE "Nft" ADD COLUMN     "category" "category";
