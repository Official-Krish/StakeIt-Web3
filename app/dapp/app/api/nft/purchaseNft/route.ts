import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { nftId, buyer, price, seller } = await req.json();
        await prisma.$transaction(async () => {
            await prisma.nft.update({
                where: {
                    id: nftId,
                },
                data: {
                    Minted: true,
                    Owner: buyer,
                    Listed: false,
                    lastSalesPrice: price
                }
            });      
            await prisma.nftTransactionHistory.create({
                data: {
                    nftId: nftId,
                    Seller: seller,
                    Buyer: buyer,
                    price: BigInt(price),
                    PurchasedAt: new Date(),
                }
            });
        });
        
        return NextResponse.json("NFT minted successfully", { status: 200 });
    } catch (error) {
        console.error("Error in GET /api/nft/getNfts:", error);
       return NextResponse.json(
            { error: "An error occurred while fetching NFTs." },
            { status: 500 }
        );
    }
}