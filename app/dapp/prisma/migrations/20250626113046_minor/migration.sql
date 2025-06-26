/*
  Warnings:

  - You are about to drop the column `createdAt` on the `NftTransactionHistory` table. All the data in the column will be lost.
  - Added the required column `PurchasedAt` to the `NftTransactionHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "NftTransactionHistory" DROP COLUMN "createdAt",
ADD COLUMN     "PurchasedAt" TIMESTAMP(3) NOT NULL;
