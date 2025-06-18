"use client"
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { motion } from 'framer-motion';
import { Coins, Image as ImageIcon, Home, Zap, WalletIcon, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { ADMIN_PUBLIC_KEY } from '@/config';
import axios from 'axios';

export default function Appbar() {
    const { connected, wallet } = useWallet();
    const pathname = usePathname(); 
    const router = useRouter();
    const [isUserData, setIsUserData] = useState(false);
    const navItems = [
        { path: '/', label: 'Home', icon: Home },
        { path: '/stake', label: 'Stake', icon: Zap },
        { path: '/claimPoints', label: 'Claim Points', icon: ImageIcon },
        { path: '/createNft', label: 'CreateNft', icon: ImageIcon }, 
        { path: '/marketplace', label: 'Marketplace', icon: ShoppingBag },
        { path: '/myNfts', label: 'My Nfts', icon: ImageIcon },
    ];

    useEffect(() => {
        if(!wallet?.adapter.publicKey || isUserData) return;
        storeUserData();
        setIsUserData(true);
    }, [wallet?.adapter.publicKey]);

    async function storeUserData() {
      if(wallet?.adapter.publicKey) {
        const res = await axios.post('/api/user', {
          publicKey: wallet.adapter.publicKey.toString(),
          name: wallet.adapter.name || 'Unknown',
        });
        if (res.status === 200) {
          localStorage.setItem('userId', res.data);
        }
      } else {
        console.log("No wallet connected, user data not stored.");
      }
    }

    useEffect(() => {
        if (connected) {
            document.cookie = 'walletConnected=true; path=/; SameSite=Lax';
        } else if (!connected) {
            document.cookie = 'walletConnected=false; path=/; SameSite=Lax';
        }
    }, [connected]);

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-gray-800/50"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-3">
                        <motion.div
                            whileHover={{ rotate: 360, scale: 1.1 }}
                            transition={{ duration: 0.6 }}
                            className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center shadow-lg"
                        >
                            <Image
                                src={`/logo.jpeg`}
                                alt="StakeIT Logo"
                                width={48}
                                height={48}
                                className="w-full h-full rounded-2xl"
                                unoptimized
                            />
                        </motion.div>
                        <div>
                            <span className="text-2xl font-black text-white">StakeIT</span>
                            <div className="text-xs text-cyan-400 font-medium">NEXT-GEN STAKING</div>
                        </div>
                    </Link>

                    {/* Navigation */}
                    <div className="flex items-center space-x-2">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.path;

                            if(connected && (item.label === "Home")){
                              return;
                            }

                            if((wallet?.adapter.publicKey?.toString() !=  ADMIN_PUBLIC_KEY) && (item.label === "CreateNft")) {
                                return null;
                            }
                            
                            return (
                                <button
                                    key={item.path}
                                    className="relative cursor-pointer"
                                    onClick={() => {
                                      if(!connected && (item.label === "Stake" || item.label === "Claim Points" || item.label === "CreateNft" || item.label === "My Nfts")) {
                                        toast.error("Please connect your wallet to access this feature.", {
                                            position: "bottom-right",
                                            autoClose: 3000,
                                            hideProgressBar: false,
                                            closeOnClick: true,
                                            pauseOnHover: true,
                                            draggable: true,
                                            progress: undefined,
                                            theme: "dark",
                                        });
                                        return;
                                      }
                                      router.push(item.path);
                                    }}
                                >
                                    <motion.div
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-bold transition-all ${
                                        isActive
                                            ? 'text-white bg-gradient-to-r from-blue-600 to-cyan-600 shadow-lg'
                                            : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                                        }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span>{item.label}</span>
                                    </motion.div>
                                </button>
                            );
                        })}
                    </div>

                    { 
                      !connected ? (
                          <WalletMultiButton className='rounded-2xl'>
                              <WalletIcon className="h-8 w-8 text-white"/>
                          </WalletMultiButton>
                      ) : (
                          <DropDown/>
                      )
                    }
                </div>
            </div>
        </motion.nav>
    );
};

const DropDown = () => {
    const { wallet, disconnect, select, wallets } = useWallet();
    const publicKey = wallet?.adapter.publicKey?.toBase58() || "";
    const [copied, setCopied] = useState(false);
    const [showWallets, setShowWallets] = useState(false);
    const [walletIcon, setWalletIcon] = useState<string | undefined>(undefined);
    const [mounted, setMounted] = useState(false);
    
    useEffect(() => {
        setMounted(true);
        if (wallet?.adapter.icon) {
            setWalletIcon(wallet.adapter.icon);
        }
    }, [wallet]);

    const handleCopy = () => {
        navigator.clipboard.writeText(publicKey);
        toast.info("Address copied to clipboard", {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
    };

    if (!mounted) {
        return (
            <div className="w-10 h-10 rounded-full bg-gray-700 animate-pulse"></div>
        );
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center shadow-lg text-white cursor-pointer">
                    <div className="w-8 h-8 rounded-full mr-2 overflow-hidden bg-gray-700">
                        {walletIcon ? (
                            <Image 
                                src={walletIcon}
                                alt="Wallet icon"
                                width={32}
                                height={32}
                                className="object-cover w-full h-full"
                                onError={() => setWalletIcon(undefined)}
                                unoptimized
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-600">
                                <WalletIcon className="w-5 h-5 text-gray-400" />
                            </div>
                        )}
                    </div>
                    <span className="hidden md:inline">
                        {wallet?.adapter.publicKey?.toString().slice(0,7).concat("...") || ""}
                    </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[180px] bg-gray-800 border-gray-600 items-center">
                    <DropdownMenuItem className="text-white cursor-pointer" onClick={handleCopy}>
                        {copied ? (
                            <div className="flex items-center">
                                <span>Copied</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <span>Copy Address</span>
                            </div>
                        )}
                    </DropdownMenuItem>
                    <Dialog>
                        <DialogTrigger asChild>
                            <DropdownMenuItem className="text-white cursor-pointer" onSelect={(e) => {
                                e.preventDefault();
                                setShowWallets(true);
                            }}>
                                <span className="flex items-center gap-2">Change Wallet</span>
                            </DropdownMenuItem>
                        </DialogTrigger>
                    </Dialog>
                    <DropdownMenuItem className="text-white cursor-pointer">
                        <button onClick={() => disconnect()} className="flex items-center gap-2">
                            Disconnect
                        </button>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={showWallets} onOpenChange={setShowWallets}>
                <DialogContent className="bg-gray-900 text-white">
                    <DialogHeader>
                        <DialogTitle>Select a Wallet</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-2 py-4 outline-none">
                        {wallets.map((wlt) => (
                            <button
                                key={wlt.adapter.name}
                                className={`w-full px-4 py-2 rounded-lg text-left hover:bg-gray-700 flex items-center gap-2 outline-none
                                    ${wallet?.adapter.name === wlt.adapter.name ? 'bg-gray-700' : ''}`}
                                onClick={() => {
                                    select(wlt.adapter.name);
                                    setShowWallets(false);
                                }}
                            >
                                {wlt.adapter.icon ? (
                                    <div className="w-5 h-5 relative">
                                        <Image
                                            src={wlt.adapter.icon}
                                            alt={wlt.adapter.name}
                                            width={20}
                                            height={20}
                                            className="object-contain"
                                            onError={(e) => {
                                                const target = e.currentTarget as HTMLImageElement;
                                                target.src = '/wallet-icon-fallback.svg';
                                            }}
                                            unoptimized
                                        />
                                    </div>
                                ) : (
                                    <div className="w-5 h-5 bg-gray-600 rounded-full flex items-center justify-center">
                                        <WalletIcon className="w-3 h-3 text-gray-400" />
                                    </div>
                                )}
                                {wlt.adapter.name}
                            </button>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};