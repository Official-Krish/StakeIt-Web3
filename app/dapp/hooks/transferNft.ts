import { AnchorWallet } from "@solana/wallet-adapter-react";
import { useNftContract } from "./contract";
import { BN } from "bn.js";
import { PublicKey } from "@solana/web3.js";

export async function TradeNft(buyer: PublicKey, seller: PublicKey, id: number, price: number, sellerWallet: AnchorWallet ) {
    const program = useNftContract(sellerWallet);

    try {
        const tx = await program.methods
                .buyNftWithSol(new BN(id), new BN(price))
                .accounts({
                    buyer: buyer,
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
