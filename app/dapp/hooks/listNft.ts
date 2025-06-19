import { AnchorWallet } from "@solana/wallet-adapter-react";
import { useNftContract } from "./contract";
import { BN } from "bn.js";
import { ADMIN_PUBLIC_KEY } from "@/config";
import { PublicKey } from "@solana/web3.js";

export async function ListNft(wallet: AnchorWallet, price: number, id: string) {
    const program = useNftContract(wallet);

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