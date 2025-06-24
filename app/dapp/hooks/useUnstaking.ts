import { BN } from "@coral-xyz/anchor";
import { useContract } from "./contract";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { ADMIN_PUBLIC_KEY } from "@/config";


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
                    admin: new PublicKey(ADMIN_PUBLIC_KEY)
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