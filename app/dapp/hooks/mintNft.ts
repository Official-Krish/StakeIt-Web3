import { AnchorWallet } from "@solana/wallet-adapter-react";
import { useNftContract } from "./contract";
import { BN } from "bn.js";

export async function MintNft(wallet: AnchorWallet, id: string, name: string, symbol: string, uri: string, pointsPrice: number, basePrice: number) {
    const program = useNftContract(wallet);
    if (!wallet.publicKey) {
        throw new Error("Wallet not connected");
    }

    try {
        const tx = await program.methods
            .createNft(
                new BN(id), 
                name,
                symbol,
                uri,
                new BN(pointsPrice),
                new BN(basePrice),
            )
            .accounts({
                user: wallet.publicKey,
            })
            .rpc();

        return {
            success: true,
            signature: tx,
            message: "Nft minted successfully"
        };
    } catch (error) {
        console.error("Minting error:", error);
        throw error;
    }
}   
