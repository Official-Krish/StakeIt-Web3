import { BN } from "@coral-xyz/anchor";
import { useContract } from "./contract";
import { AnchorWallet } from "@solana/wallet-adapter-react";


export async function unStakeTokens(wallet: AnchorWallet, amount: number) {
    const program = useContract(wallet);

        if (!wallet) {
            throw new Error("Wallet not connected");
        }

        try {
            const UnStakeAmount = amount * 1e9; 

            const txSignature = await program.methods
                .unstake(new BN(UnStakeAmount))
                .accounts({
                    user: wallet.publicKey,
                })
                .rpc(); 

            return {
                success: true,
                signature: txSignature,
                message: "UnStake successful"
            };

        } catch (error) {
            console.error("Staking error:", error);
            throw error;
        }

}