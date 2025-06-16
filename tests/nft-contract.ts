import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { NftContract } from "../target/types/nft_contract";
import assert from "assert";
import bs58 from "bs58";
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { ADMIN_KEY, USER_KEY } from "./config";
import { BN } from "bn.js";

describe("NFT-contract", async () => {
  // Configure the client to use the local cluster.
    anchor.setProvider(anchor.AnchorProvider.env());

    const program = anchor.workspace.nft_contract as Program<NftContract>;
    const userKey = bs58.decode(USER_KEY);
    const user = anchor.web3.Keypair.fromSecretKey(userKey);; 
    const secretKey = bs58.decode(ADMIN_KEY);
    const admin = anchor.web3.Keypair.fromSecretKey(secretKey);

    let mint: anchor.web3.PublicKey;
    let nftDataAccount : anchor.web3.PublicKey;
    let tokenAccount: anchor.web3.PublicKey;
    let nftMetadataAccount: anchor.web3.PublicKey;
    let masterEditionAccount: anchor.web3.PublicKey;
    
    const MPL_TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey(
        "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
    );

    // Derive the mint PDA
    [mint] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("nft_mint"), admin.publicKey.toBuffer(), new BN(9999).toArrayLike(Buffer, "le", 8)],
        program.programId
    );

    it("Create Nft", async () => {
        // Derive all necessary PDAs before the transaction
        [nftDataAccount] = anchor.web3.PublicKey.findProgramAddressSync(
            [Buffer.from("nft_data"), mint.toBuffer()],
            program.programId
        );

        // Get associated token account address
        tokenAccount = await getAssociatedTokenAddress(
            mint,
            admin.publicKey
        );

        [nftMetadataAccount] = anchor.web3.PublicKey.findProgramAddressSync(
            [
                Buffer.from("metadata"), 
                MPL_TOKEN_METADATA_PROGRAM_ID.toBuffer(), 
                mint.toBuffer(),
            ],
            MPL_TOKEN_METADATA_PROGRAM_ID
        );
        
        [masterEditionAccount] = anchor.web3.PublicKey.findProgramAddressSync(
            [
              Buffer.from("metadata"),
              MPL_TOKEN_METADATA_PROGRAM_ID.toBuffer(),
              mint.toBuffer(),
              Buffer.from("edition"),
            ],
            MPL_TOKEN_METADATA_PROGRAM_ID
        );

        const tx = await program.methods
        .createNft(
            new BN(9999), 
            "Final Testing",
            "Final 4",
            "https://img.atom.com/story_images/visual_images/1706201190-Test_main.png?class=show",
            new BN(1000),
            new BN(1000000),
        )
        .accounts({
            user: admin.publicKey,
        })
        .preInstructions([
            anchor.web3.ComputeBudgetProgram.setComputeUnitLimit({
                units: 400_000, 
            }),
        ])
        .signers([admin])
        .rpc();
        
        const nft = await program.provider.connection.getAccountInfo(mint);
        console.log("NFT Mint Account Data:", JSON.stringify(nft));
        console.log("Transaction signature:", tx);
    });

    it("Buy nft as user from SOL", async () => {
        const buyerTokenAccount = await getAssociatedTokenAddress(
            mint,
            user.publicKey
        );

        const sellerTokenAccount = await getAssociatedTokenAddress(
            mint,
            admin.publicKey
        );

        // Check balances before transaction
        const buyerBalanceBefore = await program.provider.connection.getBalance(user.publicKey);
        const sellerBalanceBefore = await program.provider.connection.getBalance(admin.publicKey);
        
        console.log("Buyer balance before:", buyerBalanceBefore / anchor.web3.LAMPORTS_PER_SOL, "SOL");
        console.log("Seller balance before:", sellerBalanceBefore / anchor.web3.LAMPORTS_PER_SOL, "SOL");

        // Ensure buyer has enough SOL (at least 2 SOL for the purchase + transaction fees)
        const requiredAmount = 2 * anchor.web3.LAMPORTS_PER_SOL;
        if (buyerBalanceBefore < requiredAmount) {
            console.log("Funding buyer account...");
            const airdropTx = await program.provider.connection.requestAirdrop(
                user.publicKey,
                requiredAmount
            );
            await program.provider.connection.confirmTransaction(airdropTx);
        }

        try {
            const tx = await program.methods
                .buyNftWithSol(new BN(9999), new BN(1.5 * anchor.web3.LAMPORTS_PER_SOL))
                .accounts({
                    buyer: user.publicKey,
                    seller: admin.publicKey,
                })
                .preInstructions([
                    anchor.web3.ComputeBudgetProgram.setComputeUnitLimit({
                        units: 400_000, 
                    }),
                ])
                .signers([user, admin, admin])
                .rpc();

            console.log("Transaction signature:", tx);
            
            // Check balances after transaction
            const buyerBalanceAfter = await program.provider.connection.getBalance(user.publicKey);
            const sellerBalanceAfter = await program.provider.connection.getBalance(admin.publicKey);
            
            console.log("Buyer balance after:", buyerBalanceAfter / anchor.web3.LAMPORTS_PER_SOL, "SOL");
            console.log("Seller balance after:", sellerBalanceAfter / anchor.web3.LAMPORTS_PER_SOL, "SOL");
            
            const userATA = await program.provider.connection.getAccountInfo(buyerTokenAccount);
            assert.ok(userATA !== null, "User token account should exist after buying NFT");
            
        } catch (error) {
            console.error("Transaction failed:", error);
            
            // Get detailed transaction logs
            if (error.logs) {
                console.log("Transaction logs:", error.logs);
            }
            
            // Try to get more details about the error
            if (error.transactionMessage) {
                console.log("Transaction message:", error.transactionMessage);
            }
            
            throw error;
        }
    });
});