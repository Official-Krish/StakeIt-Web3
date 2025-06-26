import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest){
    try {
        const { searchParams } = new URL(req.url);
        const nftId = searchParams.get("mint");
        if (!nftId) {
            return NextResponse.json(
                { error: "NFT mint address is required." },
                { status: 400 }
            );
        }

        const res = await prisma.nftTransactionHistory.findMany({
            where: {
                nftId: nftId,
            },
        });
        if (!res || res.length === 0) {
            return NextResponse.json(
                { msg: "No past buyers found for this NFT." },
                { status: 200 }
            );
        }
        const serializedNfts = res.map((nft) => ({
            ...nft,
            price: nft.price.toString(),
        }));
        return NextResponse.json(serializedNfts, { status: 200 });
    } catch (error) {
        console.error("Error in GET /api/nft/getPastBuyers:", error);
        return NextResponse.json(
            { error: "An error occurred while fetching past buyers." },
            { status: 500 }
        );
    }
}