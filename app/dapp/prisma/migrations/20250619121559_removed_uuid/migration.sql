/*
  Warnings:

  - The primary key for the `Nft` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[id]` on the table `Nft` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Nft" DROP CONSTRAINT "Nft_pkey";

-- CreateIndex
CREATE UNIQUE INDEX "Nft_id_key" ON "Nft"("id");
