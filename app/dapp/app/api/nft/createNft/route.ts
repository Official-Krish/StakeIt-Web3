import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

function generateUniqueU64(): bigint {
    const timestamp = BigInt(Date.now()) << BigInt(16); 
    const random = BigInt(Math.floor(Math.random() * 65535)); 
    return timestamp | random; 
}

export async function POST(req: NextRequest) {
   try {
        const { name, description, uri, symbol, PointsCost, BasePrice, category } = await req.json();

        if (!name || !description || !uri || !symbol || !PointsCost || !BasePrice ) {
            return NextResponse.json(
                { error: "All fields are required." },
                { status: 400 }
            );
        }

        await prisma.nft.create({
            data: {
                id: String(generateUniqueU64()),
                name,
                description,
                uri,
                symbol,
                pointPrice: PointsCost, 
                basePrice: BasePrice,
                category: category || "Uncategorized",
            }
        });

        return NextResponse.json(
            { message: "NFT created successfully." },
            { status: 200 }
        );
   } catch (error) {
        console.error("Error in POST /api/nft/createNft:", error);
        return NextResponse.json(
            { error: "An error occurred while creating the NFT." },
            { status: 500 }
        ); 
    }
}