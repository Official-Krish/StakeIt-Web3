import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
   try {
        const body = await req.json();
        const { publicKey, name } = body;

        if (!publicKey || !name) {
            return NextResponse.json(
                { error: "Missing Data." },
                { status: 400 }
            );
        }

        const existingUser = await prisma.user.findUnique({
            where: { publicKey },
        });
        if (existingUser) {
            return NextResponse.json(existingUser.id, { status: 200 });
        }

        const newUser = await prisma.user.create({
            data: {
                publicKey,
                name,
            },
        });

        return NextResponse.json(newUser.id, { status: 200 });
   } catch (error) {
        console.error("Error in POST /api/user:", error);
        return NextResponse.json(
            { error: "An error occurred while creating user." },
            { status: 500 }
        ); 
    }
}