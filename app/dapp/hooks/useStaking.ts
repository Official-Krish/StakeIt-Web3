import { BN } from "@coral-xyz/anchor";
import { useContract } from "./contract";
import { clusterApiUrl, Connection } from "@solana/web3.js";

const network = clusterApiUrl("devnet");

export function useStaking(wallet: any) {
    const program  = useContract(wallet); 

    const stakeTokens = async (amount: number) => {
        if (!wallet.connected) {
            throw new Error("Wallet not connected");
        }

        try {
            const connection = new Connection(network);

            // Check balance
            const balance = await connection.getBalance(wallet?.adapter.publicKey);
            const stakeAmount = amount * 1e9; 
            
            if (balance < stakeAmount) {
                throw new Error("Insufficient balance");
            }

            const txSignature = await program.methods
                .stake(new BN(stakeAmount))
                .accounts({
                    payer: wallet?.adapter.publicKey,
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
    };

    return {
        stakeTokens,
    };
}