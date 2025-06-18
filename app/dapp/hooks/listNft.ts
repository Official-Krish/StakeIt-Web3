import { AnchorWallet } from "@solana/wallet-adapter-react";
import { useNftContract } from "./contract";
import { BN } from "bn.js";
import { PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import { ADMIN_PUBLIC_KEY } from "@/config";

export async function ListNft(wallet: AnchorWallet, price: number, id: number) {
    const program = useNftContract(wallet);

    try {
        const [mint] = await PublicKey.findProgramAddressSync(
            [Buffer.from("mint"), new PublicKey(ADMIN_PUBLIC_KEY).toBuffer(), new BN(id).toArrayLike(Buffer, "le", 8)],
            program.programId
        );

        const tokenAccount =  await getAssociatedTokenAddress(
            mint,
            wallet.publicKey
        )
        const tx = await program.methods
            .listNft(new BN(price))
            .accounts({
                sellerTokenAccount: tokenAccount,
                seller: wallet.publicKey,
            })
        
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