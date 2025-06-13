import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { NftContract } from "../target/types/nft_contract";
import assert from "assert";
import bs58 from "bs58";
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from "@solana/spl-token";

describe("NFT-contract", () => {
  // Configure the client to use the local cluster.
    anchor.setProvider(anchor.AnchorProvider.env());

    const program = anchor.workspace.nft_contract as Program<NftContract>;
    const user = anchor.web3.Keypair.generate();
    const secretKeyBase58 = process.env.ADMIN_SECRET_KEY; 
    const secretKey = bs58.decode(secretKeyBase58);
    const admin = anchor.web3.Keypair.fromSecretKey(secretKey);


    console.log("Admin Public Key:", admin.publicKey.toBase58());

    let mint: anchor.web3.PublicKey;
    let nftDataAccount : anchor.web3.PublicKey;
    let mintAuthority: anchor.web3.PublicKey;
    let nftMetadataAccount: anchor.web3.PublicKey;
    let masterEditionAccount: anchor.web3.PublicKey; 
    
    const MPL_TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey(
        "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
    );

    it("Create Nft as Admin", async () => {
        [mint] = await anchor.web3.PublicKey.findProgramAddress(
            [Buffer.from("mint"), Buffer.from("1234"), Buffer.from("5678")],
            program.programId
        );

        [mintAuthority] = await anchor.web3.PublicKey.findProgramAddress(
            [Buffer.from("mint_authority"), mint.toBuffer()],
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

        const adminTokenAccount = await getAssociatedTokenAddress(
            mint,
            admin.publicKey
        );

        const tx = await program.methods
        .createNftAsAdmin(
            "Test NFT 2",
            "TNFT 2",
            "https://img.atom.com/story_images/visual_images/1706201190-Test_main.png?class=show",
            new anchor.BN(1000),
            new anchor.BN(1000000),
            "Random 1"
        )
        .accounts({
            admin: admin.publicKey,
            mint,
            mintAuthority: mintAuthority,
            nftData: nftDataAccount,
            nftMetadata: nftMetadataAccount,
            masterEditionAccount: masterEditionAccount,
            tokenAccount: adminTokenAccount,
            tokenProgram: TOKEN_PROGRAM_ID,
            systemProgram: anchor.web3.SystemProgram.programId,
            rent: anchor.web3.SYSVAR_RENT_PUBKEY,
            metadataProgram: MPL_TOKEN_METADATA_PROGRAM_ID,
            associatedTokenProgram: anchor.utils.token.ASSOCIATED_PROGRAM_ID, 
        })
        .signers([admin])
        .rpc();

        const nftData = await program.account.nftData.fetch(nftDataAccount);
        assert.ok(nftData.pointPrice.eq(new anchor.BN(1000)));
        assert.ok(nftData.basePrice.eq(new anchor.BN(1000000)));

        console.log("Transaction signature:", tx);
        
    });
});
