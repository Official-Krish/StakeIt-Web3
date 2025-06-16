import { AnchorWallet } from "@solana/wallet-adapter-react";
import { useContract } from "./contract";


export async function useClaimPonits(wallet: AnchorWallet, redeem_points: number) {
    const program  = useContract(wallet);

    if (!wallet.publicKey) {
        throw new Error("Wallet not connected");
    }

    try {
        const txSignature = await program.methods
            .claimPoints(redeem_points)
            .accounts({
                user: wallet.publicKey,
            })
            .rpc(); 

        return {
            success: true,
            signature: txSignature,
            message: "Points claimed successfully"
        };

    } catch (error) {
        console.error("Staking error:", error);
        throw error;
    }
}