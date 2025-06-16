import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
   try {
        const { name, description, uri, symbol, PointsCost, BasePrice } = await req.json();

        if (!name || !description || !uri || !symbol || !PointsCost || !BasePrice) {
            return NextResponse.json(
                { error: "All fields are required." },
                { status: 400 }
            );
        }

        await prisma.nft.create({
            data: {
                name,
                description,
                uri,
                symbol,
                pointPrice: PointsCost, 
                basePrice: BasePrice,
            }
        });

        return NextResponse.json(
            { message: "NFT created successfully." },
            { status: 201 }
        );
   } catch (error) {
        console.error("Error in POST /api/nft/createNft:", error);
        return NextResponse.json(
            { error: "An error occurred while creating the NFT." },
            { status: 500 }
        ); 
    }
}