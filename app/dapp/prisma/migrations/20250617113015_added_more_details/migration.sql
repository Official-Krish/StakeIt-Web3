/*
  Warnings:

  - You are about to drop the column `qauntityAvailableToMint` on the `Nft` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Nft` table. All the data in the column will be lost.
  - You are about to drop the `OwnedNft` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "OwnedNft" DROP CONSTRAINT "OwnedNft_nftId_fkey";

-- DropForeignKey
ALTER TABLE "OwnedNft" DROP CONSTRAINT "OwnedNft_userId_fkey";

-- AlterTable
ALTER TABLE "Nft" DROP COLUMN "qauntityAvailableToMint",
DROP COLUMN "updatedAt",
ADD COLUMN     "AskPrice" BIGINT,
ADD COLUMN     "Likes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "Listed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "ListedAt" TIMESTAMP(3),
ADD COLUMN     "Minted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "MintedAt" TIMESTAMP(3),
ADD COLUMN     "MintedBy" TEXT;

-- DropTable
DROP TABLE "OwnedNft";
