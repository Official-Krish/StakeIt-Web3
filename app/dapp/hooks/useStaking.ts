import { BN } from "@coral-xyz/anchor";
import { useContract } from "./contract";
import { AnchorWallet } from "@solana/wallet-adapter-react";

export async function StakeSol(wallet: AnchorWallet, amount: number) {
    const program  = useContract(wallet); 

    if (!wallet) {
        throw new Error("Wallet not connected");
    }

    try {
        const txSignature = await program.methods
            .stake(new BN(amount * 1e9))
            .accounts({
                payer: wallet?.publicKey,
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