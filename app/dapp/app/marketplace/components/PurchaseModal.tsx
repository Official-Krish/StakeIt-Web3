"use client";
import { TradeNft } from "@/hooks/transferNft";
import { MarketplaceNFT } from "@/types/nft";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion"
import { AlertCircle, CheckCircle, Heart, ShoppingBag, Wallet, X } from "lucide-react";
import Image from "next/image"
import { useState } from "react";
import { toast } from "react-toastify";

export const PurchaseModal = ({ selectedNFT, setShowPurchaseModal, setSelectedNFT } : { selectedNFT: any, setShowPurchaseModal: () => void, setSelectedNFT: () => void }) => {  
    const wallet = useAnchorWallet();; 
    const [purchaseStatus, setPurchaseStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
    
    const confirmPurchase = async (nft: MarketplaceNFT) => {
        if (!selectedNFT) return;
        
        setPurchaseStatus('processing');
        
        // Simulate purchase process
        await TradeNft(new PublicKey(nft.Owner), Number(nft.id), wallet!);
        try {
            axios.post('/api/nft/purchaseNft', {
                nftId: nft.id,
                buyer: wallet?.publicKey?.toString(),
                price: nft.AskPrice,
                
            });
            setPurchaseStatus('success');
            toast.success(`Successfully purchased ${nft.name}!`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true, 
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        } catch (error) {
            setPurchaseStatus('error');
            console.error("Purchase error:", error);
        }
    };
    return <div>
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                onClick={() => setShowPurchaseModal()}
            >
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl border border-gray-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-700">
                    <h2 className="text-2xl font-black text-white">Purchase NFT</h2>
                    <button
                        onClick={() => setShowPurchaseModal()}
                        className="w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded-xl flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                    >
                    <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Modal Content */}
                <div className="p-6">
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* NFT Image */}
                        <div className="relative">
                            <Image
                                src={selectedNFT.uri}
                                alt={selectedNFT.name}
                                width={500}
                                height={500}
                                className="w-full h-80 object-cover rounded-2xl"
                            />
                        </div>
                    </div>

                    {/* NFT Details */}
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-3xl font-black text-white mb-2">
                                {selectedNFT.name}
                            </h3>
                            <p className="text-gray-400 mb-4">
                                by {selectedNFT.MintedBy}
                            </p>
                            <p className="text-gray-300 leading-relaxed">
                                {selectedNFT.description}
                            </p>
                        </div>

                            {/* Price Info */}
                            <div className="bg-gray-700/30 rounded-2xl p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-gray-400">Current Price</span>
                                    <div className="flex items-center space-x-2">
                                        <Wallet className="w-5 h-5 text-cyan-400" />
                                        <span className="text-2xl font-black text-white">
                                            {selectedNFT.AskPrice / LAMPORTS_PER_SOL} SOL
                                        </span>
                                    </div>
                                </div>
                                <div className="text-sm text-gray-400">
                                    ≈ ${(Number(selectedNFT.AskPrice / LAMPORTS_PER_SOL) * 180).toFixed(2)} USD
                                </div>
                            </div>

                            {/* Purchase Button */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => confirmPurchase(selectedNFT)}
                                disabled={purchaseStatus === 'processing'}
                                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-4 px-6 rounded-2xl font-bold text-lg flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {purchaseStatus === 'processing' ? (
                                    <>
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                        />
                                        <span>Processing...</span>
                                    </>
                                ) : purchaseStatus === 'success' ? (
                                    <>
                                        <CheckCircle className="w-5 h-5" />
                                        <span>Purchase Successful!</span>
                                    </>
                                ) : purchaseStatus === 'error' ? (
                                    <>
                                        <AlertCircle className="w-5 h-5" />
                                        <span>Insufficient Balance</span>
                                    </>
                                ) : (
                                    <>
                                        <ShoppingBag className="w-5 h-5" />
                                        <span>Buy Now for {selectedNFT.AskPrice / LAMPORTS_PER_SOL} SOL</span>
                                    </>
                                )}
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    </div>
}