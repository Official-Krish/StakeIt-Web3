import { BN } from "@coral-xyz/anchor";
import { useContract } from "./contract";


export function useUnStaking(wallet: any) {
    const program = useContract(wallet);

    const unStakeTokens = async (amount: number) => {
        if (!wallet.connected) {
            throw new Error("Wallet not connected");
        }

        try {
            const UnStakeAmount = amount * 1e9; 

            const txSignature = await program.methods
                .unstake(new BN(UnStakeAmount))
                .accounts({
                    user: wallet?.adapter.publicKey,
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
    };

    return {
        unStakeTokens,
    };
}