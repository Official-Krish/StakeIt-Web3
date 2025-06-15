import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { NftContract } from "../target/types/nft_contract";
import assert from "assert";
import bs58 from "bs58";
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { ADMIN_KEY } from "./config";

describe("NFT-contract", async () => {
  // Configure the client to use the local cluster.
    anchor.setProvider(anchor.AnchorProvider.env());

    const program = anchor.workspace.nft_contract as Program<NftContract>;
    const user = anchor.web3.Keypair.generate();; 
    const secretKey = bs58.decode(ADMIN_KEY);
    const admin = anchor.web3.Keypair.fromSecretKey(secretKey);
    console.log("Admin Public Key:", admin.publicKey.toBase58());

    let mint: anchor.web3.PublicKey;
    let nftDataAccount : anchor.web3.PublicKey;
    let mintAuthority: anchor.web3.PublicKey;
    let nftMetadataAccount: anchor.web3.PublicKey;
    let masterEditionAccount: anchor.web3.PublicKey;
    const id = 1234;
    
    const MPL_TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey(
        "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
    );

    // before(async () => {
    //     await program.methods.initializeCounter()
    //         .accounts({
    //             admin: admin.publicKey,
    //         })
    //         .signers([admin])
    //         .rpc();
    // });

    it("Create Nft as Admin", async () => {
        [mint] = await anchor.web3.PublicKey.findProgramAddress(
            [Buffer.from("mint"), admin.publicKey.toBuffer(), new anchor.BN(id).toArrayLike(Buffer, "le", 8), Buffer.from("Token")],
            program.programId
        );

        [nftDataAccount] = await anchor.web3.PublicKey.findProgramAddress(
            [Buffer.from("nft_data"), mint.toBuffer()],
            program.programId
        );

        [nftMetadataAccount] = await anchor.web3.PublicKey.findProgramAddress(
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
        .createNftAsAdmin(
            "Token",
            "token 4",
            "https://img.atom.com/story_images/visual_images/1706201190-Test_main.png?class=show",
            new anchor.BN(1000),
            new anchor.BN(1000000),
            new anchor.BN(id)
        )
        .accounts({
            mint
        })
        .preInstructions([
            anchor.web3.ComputeBudgetProgram.setComputeUnitLimit({
                units: 400_000, 
            }),
        ])
        .signers([admin])
        .rpc();

        const nftData = await program.account.nftData.fetch(nftDataAccount);
        assert.ok(nftData.pointPrice.eq(new anchor.BN(1000)));
        assert.ok(nftData.basePrice.eq(new anchor.BN(1000000)));
        const nft = await program.provider.connection.getAccountInfo(mint);
        console.log("NFT Mint Account Data:", JSON.stringify(nft.data));

        console.log("Transaction signature:", tx);
        
    });

    it("transfers nft to vault", async() => {
        const tx = await program.methods
            .batchMintToVault(new anchor.BN(id), new anchor.BN(1))
            .accounts({
                admin: admin.publicKey,
                mint: mint,
                tokenProgram: TOKEN_PROGRAM_ID,
                associatedTokenProgram: anchor.utils.token.ASSOCIATED_PROGRAM_ID,
                systemProgram: anchor.web3.SystemProgram.programId,
                rent: anchor.web3.SYSVAR_RENT_PUBKEY,
            })
            .signers([admin])
            .rpc();
        
        const vaultTokenAccount = await getAssociatedTokenAddress(
            mint,
            admin.publicKey
        );
        const vaultATA = await program.provider.connection.getAccountInfo(vaultTokenAccount);
        assert.ok(vaultATA !== null, "Vault token account should exist after minting NFT");
        console.log("Vault Token Account:", vaultTokenAccount.toBase58());
        console.log("Vault Token Account Data:", JSON.stringify(vaultATA.data));
        console.log("Transaction signature:", tx);
    });

    it("Buy nft as user from points", async () => {
        const userTokenAccount = await getAssociatedTokenAddress(
            mint,
            user.publicKey
        );

        const tx = await program.methods
            .buyNftWithPoints(
                new anchor.BN(2345), 
                "Token",
                "token 4",
                "https://img.atom.com/story_images/visual_images/1706201190-Test_main.png?class=show",
                new anchor.BN(1000),
                new anchor.BN(1000000),
            )
            .accounts({
                user: user.publicKey,
            })
            .signers([user, admin])
            .rpc();

        console.log("Transaction signature:", tx);
        const userATA = await program.provider.connection.getAccountInfo(userTokenAccount);
        assert.ok(userATA !== null, "User token account should exist after buying NFT");
    })

    it("Buy nft as user from SOL", async () => {
        const userTokenAccount = await getAssociatedTokenAddress(
            mint,
            user.publicKey
        );

        const tx = await program.methods
            .buyNftWithSol(new anchor.BN(1.5 * Math.pow(10, 9)), new anchor.BN(id))
            .accounts({
                buyer: user.publicKey,
                seller: admin.publicKey,
            })
            .signers([user, admin])
            .rpc();

        console.log("Transaction signature:", tx);
        const userATA = await program.provider.connection.getAccountInfo(userTokenAccount);
        assert.ok(userATA !== null, "User token account should exist after buying NFT");
    });

});
