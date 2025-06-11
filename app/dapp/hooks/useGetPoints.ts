import { useContract } from "./contract";


export function useGetPoints(wallet: any) {
    const program  = useContract(wallet);

    const updatePoints = async () => {
        if (!wallet.connected || !wallet.publicKey) {
            throw new Error("Wallet not connected");
        }

        try {
            const txSignature =   await program.methods.getPoints().accounts({
                user: wallet?.adapter.publicKey,
            }).rpc();

            return {
                success: true,
                signature: txSignature,
                message: "Points retrieved successfully",
            };

        } catch (error) {
            console.error("Staking error:", error);
            throw error;
        }
    };

    return {
        updatePoints,
    };
}