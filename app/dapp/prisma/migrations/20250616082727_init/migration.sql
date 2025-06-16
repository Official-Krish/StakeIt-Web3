-- CreateTable
CREATE TABLE "nft" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "symbol" TEXT,
    "uri" TEXT NOT NULL,
    "pointPrice" BIGINT NOT NULL,
    "BasePrice" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ownerId" TEXT,

    CONSTRAINT "nft_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "PublicKey" TEXT NOT NULL,
    "StakedSol" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_PublicKey_key" ON "user"("PublicKey");

-- AddForeignKey
ALTER TABLE "nft" ADD CONSTRAINT "nft_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "user"("PublicKey") ON DELETE SET NULL ON UPDATE CASCADE;
