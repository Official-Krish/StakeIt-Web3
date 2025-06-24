import { BN } from "bn.js";
import { StakingContract } from "./contract";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { ADMIN_PUBLIC_KEY } from "@/config";
import { ProgramError } from "@coral-xyz/anchor";
 

export const getPdaAccountData = async (wallet: AnchorWallet) => {
    const program = StakingContract(wallet);
  
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

export async function UpdatePoints(wallet: AnchorWallet) {
    const program  = StakingContract(wallet);
    if (!wallet) {
        throw new Error("Wallet not connected");
    }

    try {
        const txSignature = await program.methods
            .getPoints()
            .accounts({
                user: wallet?.publicKey,
            })
            .rpc(); 

        return {
            success: true,
            signature: txSignature,
            message: "Stake successful"
        };

    } catch (error) {
        console.error("Staking error:", error);
        throw error;
    }
}

export async function ClaimPonits(wallet: AnchorWallet, redeem_points: number) {
    const program  = StakingContract(wallet);
    if (!wallet.publicKey) {
        throw new Error("Wallet not connected");
    }

    try {
        const txSignature = await program.methods
            .claimPoints(redeem_points)
            .accounts({
                user: wallet.publicKey,
            })
            .rpc(); 

        return {
            success: true,
            signature: txSignature,
            message: "Points claimed successfully"
        };

    } catch (error) {
        console.error("Staking error:", error);
        throw error;
    }
}


export function GetPoints(wallet: any) {
    const program  = StakingContract(wallet);

    const updatePoints = async () => {
        if (!wallet.connected || !wallet.publicKey) {
            throw new Error("Wallet not connected");
        }

        try {
            const txSignature =   await program.methods.getPoints().accounts({
                user: wallet?.adapter.publicKey,
            }).rpc();

            return {
                success: true,
                signature: txSignature,
                message: "Points retrieved successfully",
            };

        } catch (error) {
            console.error("Staking error:", error);
            throw error;
        }
    };

    return {
        updatePoints,
    };
}

export async function StakeSol(wallet: AnchorWallet, amount: number) {
    const program  = StakingContract(wallet); 

    if (!wallet) {
        throw new Error("Wallet not connected");
    }

    try {
        const txSignature = await program.methods
            .stake(new BN(amount * 1e9))
            .accounts({
                payer: wallet?.publicKey,
            })
            .rpc(); 

        return {
            success: true,
            signature: txSignature,
            message: "Stake successful"
        };

    } catch (error) {
        console.error("Staking error:", error);
        throw error;
    }
}

export async function UnstakeTokens(wallet: AnchorWallet, amount: number) {
    const program = StakingContract(wallet);

        if (!wallet) {
            throw new Error("Wallet not connected");
        }

        try {
            const UnStakeAmount = amount * 1e9; 

            const txSignature = await program.methods
                .unstake(new BN(UnStakeAmount))
                .accounts({
                    user: wallet.publicKey,
                    admin: new PublicKey(ADMIN_PUBLIC_KEY)
                })
                .rpc(); 

            return {
                success: true,
                signature: txSignature,
                message: "UnStake successful"
            };

        } catch (error) {
            console.error("Staking error:", error);
            throw error;
        }

}

export async function CreatePda(wallet: AnchorWallet) {
    const program  = StakingContract(wallet);
    console.log("Wallet:", wallet.publicKey);
    if (!wallet) {
        throw new Error("Wallet not connected");
    }

    try {
        const txSignature =  await program.methods.createPdaAccount().accounts({
            payer: wallet?.publicKey,
        }).rpc();

        return {
            success: true,
            signature: txSignature,
            message: "PDA creation successful",
        };

    } catch (error) {
        if (error instanceof ProgramError) {
            // Error code 0x0 usually means "account already exists"
            if (error.code === 0) {
                return {
                    success: true,
                    exists: true,
                    message: "PDA already exists",
                };
            }
        }

        // Handle transaction simulation failures
        if (error instanceof Error && error.message.includes("already in use")) {
            return {
                success: true,
                exists: true,
                message: "PDA already exists",
            };
        }

        console.error("PDA creation failed:", error);
        throw new Error(`PDA creation failed: ${error instanceof Error ? error.message : "Unknown error"}`);

    }
}