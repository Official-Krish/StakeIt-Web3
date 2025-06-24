import { AnchorWallet } from "@solana/wallet-adapter-react";
import { NftContract } from "./contract";
import { BN } from "bn.js";
import { ADMIN_PUBLIC_KEY } from "@/config";
import { PublicKey } from "@solana/web3.js";

export async function ListNft(wallet: AnchorWallet, price: number, id: string) {
    const program = NftContract(wallet);

    try {
        const tx = await program.methods
            .listNft(new BN(price), new BN(id))
            .accounts({
                admin: new PublicKey(ADMIN_PUBLIC_KEY),
                seller: wallet.publicKey,
            })
            .rpc();
        
        return {
            success: true,
            signature: tx,
            message: "Nft listed successfully"
        }
    } catch (error) {
        console.error("Listing error:", error);
        return {
            success: false,
            message: "Failed to list NFT",
            error: error || "Unknown error"
        };
    }
}

export async function MintNft(wallet: AnchorWallet, id: string, name: string, symbol: string, uri: string, pointsPrice: number, basePrice: number) {
    const program = NftContract(wallet);
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

export async function TradeNft(seller: PublicKey, id: string, BuyerWallet: AnchorWallet) {
    const program = NftContract(BuyerWallet);

    try {
        const tx = await program.methods
            .buyNftWithSol(new BN(id))
            .accounts({
                admin: new PublicKey(ADMIN_PUBLIC_KEY),
                seller: seller,
                buyer: BuyerWallet.publicKey,
            })
            .rpc();

        return { success: true, tx };
    } catch (error) {
        console.error("Buy error:", error);
        throw error;
    }
}