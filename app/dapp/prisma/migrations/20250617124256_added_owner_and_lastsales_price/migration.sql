-- AlterTable
ALTER TABLE "Nft" ADD COLUMN     "Owner" TEXT,
ADD COLUMN     "lastSalesPrice" TEXT DEFAULT 'You are the first buyer';
