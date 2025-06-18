import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { Owner, NftId, Price } = await req.json();
        await prisma.nft.update({
            where: {
                id: BigInt(NftId),
                Owner: Owner,
            },
            data: {
                AskPrice: BigInt(Price),
                Listed: true,
                ListedAt: new Date(),
            }
        });
        return NextResponse.json("NFT Listed successfully", { status: 200 });
    } catch (error) {
        console.error("Error in GET /api/nft/getNfts:", error);
       return NextResponse.json(
            { error: "An error occurred while fetching NFTs." },
            { status: 500 }
        );
    }
}