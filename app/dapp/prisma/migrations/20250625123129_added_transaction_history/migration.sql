-- CreateTable
CREATE TABLE "NftTransactionHistory" (
    "id" TEXT NOT NULL,
    "nftId" TEXT NOT NULL,
    "Seller" TEXT NOT NULL,
    "Buyer" TEXT NOT NULL,
    "price" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NftTransactionHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "NftTransactionHistory" ADD CONSTRAINT "NftTransactionHistory_nftId_fkey" FOREIGN KEY ("nftId") REFERENCES "Nft"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
