import { clusterApiUrl, Connection } from "@solana/web3.js";
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import idl from '../idl/staking_contract.json';
import { AnchorWallet } from "@solana/wallet-adapter-react";

const network = clusterApiUrl("devnet");

export function useContract(wallet: AnchorWallet): Program {
    if (!wallet) {
        throw new Error("Wallet not connected");
    }
    const connection = new Connection(network);
    const provider = new AnchorProvider(connection, wallet, {});

    const program = new Program(idl as any, provider);
    
    return program;
}

export function useNftContract(wallet: AnchorWallet): Program {
    if (!wallet) {
        throw new Error("Wallet not connected");
    }
    const connection = new Connection(network);
    const provider = new AnchorProvider(connection, wallet, {});

    const nftProgramIdl = require('../idl/nft_contract.json');
    const nftProgram = new Program(nftProgramIdl as any, provider);
    
    return nftProgram;
}