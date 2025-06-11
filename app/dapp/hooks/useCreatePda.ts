import { ProgramError } from "@coral-xyz/anchor";
import { useContract } from "./contract";
import { AnchorWallet } from "@solana/wallet-adapter-react";


export async function CreatePda(wallet: AnchorWallet) {
    const program  = useContract(wallet);
    console.log("Wallet:", wallet.publicKey);
    if (!wallet) {
        throw new Error("Wallet not connected");
    }

    try {
        const txSignature =  await program.methods.createPdaAccount().accounts({
            payer: wallet?.publicKey,
        }).rpc();

        return {
            success: true,
            signature: txSignature,
            message: "PDA creation successful",
        };

    } catch (error) {
        if (error instanceof ProgramError) {
            // Error code 0x0 usually means "account already exists"
            if (error.code === 0) {
                return {
                    success: true,
                    exists: true,
                    message: "PDA already exists",
                };
            }
        }

        // Handle transaction simulation failures
        if (error instanceof Error && error.message.includes("already in use")) {
            return {
                success: true,
                exists: true,
                message: "PDA already exists",
            };
        }

        console.error("PDA creation failed:", error);
        throw new Error(`PDA creation failed: ${error instanceof Error ? error.message : "Unknown error"}`);

    }
}