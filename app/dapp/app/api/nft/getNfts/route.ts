import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const nfts = await prisma.nft.findMany();
        const serializedNfts = nfts.map((nft) => ({
            ...nft,
            id: nft.id.toString(), 
            pointPrice: nft.pointPrice.toString(),
            basePrice: nft.basePrice.toString(),
        }));

        return NextResponse.json(serializedNfts, { status: 200 });
    } catch (error) {
        console.error("Error in GET /api/nft/getNfts:", error);
       return NextResponse.json(
            { error: "An error occurred while fetching NFTs." },
            { status: 500 }
        );
        return;
    }
}