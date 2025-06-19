import { useContract } from "./contract";
import { AnchorWallet } from "@solana/wallet-adapter-react";

export async function UpdatePoints(wallet: AnchorWallet) {
    const program  = useContract(wallet); 

    if (!wallet) {
        throw new Error("Wallet not connected");
    }

    try {
        const txSignature = await program.methods
            .getPoints()
            .accounts({
                user: wallet?.publicKey,
            })
            .rpc(); 

        return {
            success: true,
            signature: txSignature,
            message: "Stake successful"
        };

    } catch (error) {
        console.error("Staking error:", error);
        throw error;
    }
}