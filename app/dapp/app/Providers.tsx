'use client';

import { SessionProvider } from "next-auth/react"
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import '@solana/wallet-adapter-react-ui/styles.css'
import { clusterApiUrl } from '@solana/web3.js'

export const Providers = ({ children }: { children: React.ReactNode }) => {
    return <SessionProvider>
        <ConnectionProvider endpoint={clusterApiUrl('devnet')}>
            <WalletProvider wallets={[]} autoConnect>
                <WalletModalProvider>
                    {children}
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    </SessionProvider>
}