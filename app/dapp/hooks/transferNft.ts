import { AnchorWallet } from "@solana/wallet-adapter-react";
import { useNftContract } from "./contract";
import { BN } from "bn.js";
import { PublicKey } from "@solana/web3.js";
import { ADMIN_PUBLIC_KEY } from "@/config";

export async function TradeNft(seller: PublicKey, id: number, price: number, BuyerWallet: AnchorWallet ) {
    const program = useNftContract(BuyerWallet);

    try {
        const tx = await program.methods
                .buyNftWithSol(new BN(id))
                .accounts({
                    admin: ADMIN_PUBLIC_KEY,
                    seller: seller,
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
