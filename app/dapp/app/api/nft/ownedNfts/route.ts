import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const MintedBy = searchParams.get("MintedBy");
    if (!MintedBy) {
        return NextResponse.json(
            { error: "MintedBy parameter is required." },
            { status: 400 }
        );
    }
    
    try {
        const nfts = await prisma.nft.findMany({
            where: {
                MintedBy: MintedBy
            }
        });
        const serializedNfts = nfts.map((nft) => ({
            ...nft,
            id: nft.id.toString(), 
            pointPrice: nft.pointPrice.toString(),
            basePrice: nft.basePrice.toString(),
            AskPrice: nft.AskPrice === null ? "0" : nft.AskPrice.toString(),
        }));

        return NextResponse.json(serializedNfts, { status: 200 });
    } catch (error) {
        console.error("Error in GET /api/nft/getNfts:", error);
       return NextResponse.json(
            { error: "An error occurred while fetching NFTs." },
            { status: 500 }
        );
    }
}