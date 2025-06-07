import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { StakingContract } from "../target/types/staking_contract";
import assert from "assert";

describe("staking-contract", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.stakingContract as Program<StakingContract>;
  const user = anchor.web3.Keypair.generate();
  let pdaAccount: anchor.web3.PublicKey;
  let bump: number;

  before(async () => {
    const airdropSignature = await anchor.getProvider().connection.requestAirdrop(
      user.publicKey,
      3 * anchor.web3.LAMPORTS_PER_SOL
    );
    await anchor.getProvider().connection.confirmTransaction(airdropSignature);
  });
  

  before(async () => {
    [pdaAccount, bump] = await anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("pda_account"), user.publicKey.toBuffer()],
      program.programId
    );
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
    .signers([user])
    .rpc();
    const account = await program.account.stakeAccount.fetch(pdaAccount);
  })

  it("claims Points", async () => {
    const tx = await program.methods.claimPoints().accounts({
      user: user.publicKey,
    })
    .signers([user])
    .rpc();
    const account = await program.account.stakeAccount.fetch(pdaAccount);
    assert.ok(account.totalPoints.eq(new anchor.BN(0)));
  });

  it("Unstakes 0.5 SOL", async () => {
    const tx = await program.methods.unstake(new anchor.BN(anchor.web3.LAMPORTS_PER_SOL / 2))
      .accounts({
        user: user.publicKey,
      })
      .signers([user])
      .rpc();
    const account = await program.account.stakeAccount.fetch(pdaAccount);
    assert.ok(account.stakedAmount.eq(new anchor.BN(anchor.web3.LAMPORTS_PER_SOL / 2)));
  });

  it("unstakes more than staked amount", async () => {
    try {
      await program.methods.unstake(new anchor.BN(anchor.web3.LAMPORTS_PER_SOL))
        .accounts({
          user: user.publicKey,
        })
        .signers([user])
        .rpc();
      assert.fail("Expected error not thrown");
    } catch (err) {
      assert.ok(err.message.includes("Insufficient staked amount"));
    }
  })
});
