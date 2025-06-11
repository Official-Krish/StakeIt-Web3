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
        console.error("Staking error:", error);
        throw error;
    }
}