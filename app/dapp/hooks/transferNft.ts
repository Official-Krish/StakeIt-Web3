import { AnchorWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useNftContract } from "./contract";
import { ADMIN_PUBLIC_KEY } from "@/config";
import BN from "bn.js";

export async function TradeNft(seller: PublicKey, id: string, BuyerWallet: AnchorWallet) {
    const program = useNftContract(BuyerWallet);

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