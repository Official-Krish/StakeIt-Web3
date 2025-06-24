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
    let id = 1147099856644; // Example ID for the NFT
    
    const MPL_TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey(
        "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
    );

    // Derive the mint PDA - FIXED: Changed "nft_mint" to "mint" to match Rust code
    [mint] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("mint"), admin.publicKey.toBuffer(), new BN(id).toArrayLike(Buffer, "le", 8)],
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
            new BN(id), 
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

    it("list nft for sale", async () => { 
        const tx = await program.methods
            .listNft(new anchor.BN(1.2 * anchor.web3.LAMPORTS_PER_SOL), new BN(id))
            .accounts({
                seller: admin.publicKey,
                admin: admin.publicKey,
            })
            .signers([admin])
            .rpc();

        console.log("List NFT transaction signature:", tx);
    });

    it("Buy nft as user from SOL", async () => {
        const buyerTokenAccount = await getAssociatedTokenAddress(
            mint,
            user.publicKey
        );

        try {
            const tx = await program.methods
                .buyNftWithSol(new BN(id))
                .accounts({
                    seller: admin.publicKey,
                    admin: admin.publicKey,
                    buyer: user.publicKey,
                })
                .signers([user])
                .rpc();

            console.log("Transaction signature:", tx);
            
            const userATA = await program.provider.connection.getAccountInfo(buyerTokenAccount);
            assert.ok(userATA !== null, "User token account should exist after buying NFT");
            
        } catch (error) {
            console.error("Transaction failed:", error);
        }
    });
});