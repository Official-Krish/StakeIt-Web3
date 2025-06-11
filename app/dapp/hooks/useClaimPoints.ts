import { useContract } from "./contract";


export function useClaimPonits(wallet: any) {
    const program  = useContract(wallet);

    const claimPoints = async (redeem_points: number) => {
        if (!wallet.connected) {
            throw new Error("Wallet not connected");
        }

        try {
            const txSignature = await program.methods
                .claimPoints(redeem_points)
                .accounts({
                    user: wallet?.adapter.publicKey,
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
    };

    return {
        claimPoints,
    };
}