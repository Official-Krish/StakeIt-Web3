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
    
    const MPL_TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey(
        "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
    );

    let counterAccount: anchor.web3.PublicKey;
    [counterAccount] = await anchor.web3.PublicKey.findProgramAddress(
        [Buffer.from("nft_counter"), admin.publicKey.toBuffer(), Buffer.from("counter")],
        program.programId
    );

    before(async () => {
        await program.methods.initializeCounter()
            .accounts({
                admin: admin.publicKey,
            })
            .signers([admin])
            .rpc();
    });

    it("Create Nft as Admin", async () => {
        const counterData = await program.account.nftCounter.fetch(counterAccount);
        const currentCount = counterData.count.toNumber();
        const countBuffer = new anchor.BN(currentCount).toArrayLike(Buffer, "le", 8);
        console.log("Count buffer as array:", Array.from(countBuffer));
        console.log("Count buffer hex:", countBuffer.toString('hex'));

        [mint] = await anchor.web3.PublicKey.findProgramAddress(
            [Buffer.from("mint"), admin.publicKey.toBuffer(), new anchor.BN(currentCount).toArrayLike(Buffer, "le", 8)],
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
            "Test NFT 3",
            "TNFT 3",
            "https://img.atom.com/story_images/visual_images/1706201190-Test_main.png?class=show",
            new anchor.BN(1000),
            new anchor.BN(1000000),
        )
        .accounts({
            counterAccount,
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

        console.log("Transaction signature:", tx);
        
    });
});
