import { PublicKey } from "@solana/web3.js";
import { useContract } from "./contract";
import { AnchorWallet } from "@solana/wallet-adapter-react";

export const getPdaAccountData = async (wallet: AnchorWallet) => {
  const program = useContract(wallet);

  if (!wallet) {
    console.error("Wallet not connected");
    return null;
  }

  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from("pda_account"), wallet.publicKey.toBuffer()],
    program.programId
  );

  try {
    const stakeAccount = await (program.account as any).stakeAccount.fetch(pda);
    return stakeAccount; 
  } catch (error) {
    console.error("Error fetching stake account", error);
    return null;
  }
};