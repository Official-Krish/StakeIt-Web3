import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { StakingContract } from "../target/types/staking_contract";
import assert from "assert";
import bs58 from "bs58";
import { ADMIN_KEY } from "./config";

describe("staking-contract", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.stakingContract as Program<StakingContract>;
  const user = anchor.web3.Keypair.generate();
  let pdaAccount: anchor.web3.PublicKey;
  let bump: number;
  let vaultPda: anchor.web3.PublicKey;

  const secretKey = bs58.decode(ADMIN_KEY);
  const admin = anchor.web3.Keypair.fromSecretKey(secretKey);

  before(async () => {
    const airdropSignature = await anchor.getProvider().connection.requestAirdrop(
      user.publicKey,
      3 * anchor.web3.LAMPORTS_PER_SOL
    );
    const airdropSignature2 = await anchor.getProvider().connection.requestAirdrop(
      admin.publicKey,
      3 * anchor.web3.LAMPORTS_PER_SOL
    );
    await anchor.getProvider().connection.confirmTransaction(airdropSignature);
    await anchor.getProvider().connection.confirmTransaction(airdropSignature2);
    console.log("Airdropped 3 SOL to user account:", user.publicKey.toBase58());
  });
  

  before(async () => {
    [pdaAccount, bump] = await anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("pda_account"), user.publicKey.toBuffer()],
      program.programId
    );

    [vaultPda] = await anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("vault_account"), admin.publicKey.toBuffer(), Buffer.from("vault")],
      program.programId
    );
    console.log("PDA Account:", pdaAccount.toBase58());
    console.log("Vault PDA Account:", vaultPda.toBase58());
  });


  it("Create PDA Account", async () => {
    const tx = await program.methods.createPdaAccount().accounts({
      payer: user.publicKey,
    })
    .signers([user])
    .rpc();
    console.log("Your transaction signature", tx);
    const account = await program.account.stakeAccount.fetch(pdaAccount);
    assert.ok(account.owner.equals(user.publicKey));
    assert.ok(account.stakedAmount.eq(new anchor.BN(0)));
    assert.ok(account.totalPoints.eq(new anchor.BN(0)));
    assert.ok(account.bump === bump);
    console.log("PDA Account Bump:", account.bump);

  });

  it("Initialize Vault Account", async () => {
    const tx = await program.methods.initializeVault().accounts({
      admin: admin.publicKey,
    })
    .signers([admin])
    .rpc();
    console.log("Vault Account initialized with transaction signature:", tx);
    const vaultAccount = await program.account.vaultAccount.fetch(vaultPda);
    assert.ok(vaultAccount.owner.equals(admin.publicKey));
  });

  it("funds vault account", async () => {
    const tx = await program.methods.fundVault(new anchor.BN(0.5 * anchor.web3.LAMPORTS_PER_SOL))
      .accounts({
        admin: admin.publicKey,
      })
      .signers([admin])
      .rpc();
    const vaultAccountBalance = await anchor.getProvider().connection.getBalance(vaultPda); 
    console.log("Vault Account Balance:", vaultAccountBalance);
    assert.ok(vaultAccountBalance > 0);
  });

  it("Stakes 1 SOL", async () => {
    const tx = await program.methods.stake(new anchor.BN(anchor.web3.LAMPORTS_PER_SOL))
      .accounts({
        payer: user.publicKey,
      })
      .signers([user])
      .rpc();
    const account = await program.account.stakeAccount.fetch(pdaAccount);
    assert.ok(account.stakedAmount.eq(new anchor.BN(anchor.web3.LAMPORTS_PER_SOL)));
  })

  it("Gets Points", async() => {
    const tx = await program.methods.getPoints().accounts({
      user: user.publicKey,
    })
    .rpc();
    const account = await program.account.stakeAccount.fetch(pdaAccount);
    console.log("Points:", account.totalPoints.toString());
  })

  it("claims Points", async () => {
    const tx = await program.methods.claimPoints(0).accounts({
      user: user.publicKey,
    })
    .signers([user])
    .rpc();
    const account = await program.account.stakeAccount.fetch(pdaAccount);
    assert.ok(account.totalPoints.eq(new anchor.BN(0)));
  });

  it("Unstakes 0.5 SOL", async () => {
    console.log("Unstaking 0.5 SOL");
    const tx = await program.methods.unstake(new anchor.BN(anchor.web3.LAMPORTS_PER_SOL / 2))
      .accounts({
        user: user.publicKey,
        admin: admin.publicKey,
      })
      .signers([user])
      .rpc();
    console.log("Unstake transaction signature:", tx);
    const account = await program.account.stakeAccount.fetch(pdaAccount);
    assert.ok(account.stakedAmount.eq(new anchor.BN(anchor.web3.LAMPORTS_PER_SOL / 2)));
  });

  it("unstakes more than staked amount", async () => {
    try {
      await program.methods.unstake(new anchor.BN(100 * anchor.web3.LAMPORTS_PER_SOL))
        .accounts({
          user: user.publicKey,
          admin: admin.publicKey,
        })
        .signers([user])
        .rpc();
      assert.fail("Expected error not thrown");
    } catch (err) {
      assert.ok(err.message.includes("Insufficient staked amount"));
    }
  })
});
