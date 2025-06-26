"use client";
import { TradeNft } from "@/hooks/Nft-Contract";
import { MarketplaceNFT, NFTTransactionHistory } from "@/types/nft";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion"
import { AlertCircle, CheckCircle, Clock, Heart, ShoppingBag, User, Wallet, X } from "lucide-react";
import Image from "next/image"
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export const PurchaseModal = ({ selectedNFT, setShowPurchaseModal, setSelectedNFT } : { selectedNFT: any, setShowPurchaseModal: () => void, setSelectedNFT: () => void }) => {  
    const wallet = useAnchorWallet();; 
    const [purchaseStatus, setPurchaseStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
    const [usdPrice, setUsdPrice] = useState<number>(0);
    const [pastBuyers, setPastBuyers] = useState<NFTTransactionHistory[]>([]);

    useEffect(() => {
        const getPrice = async () => {
            const res = await axios.get("https://lite-api.jup.ag/price/v3?ids=So11111111111111111111111111111111111111112")
            setUsdPrice(Number(res.data.So11111111111111111111111111111111111111112.usdPrice));
        }

        const getPastBuyers = async () => {
            if (!selectedNFT) return;
            try {
                const res = await axios.get(`/api/nft/getPastBuyers?mint=${selectedNFT.id}`);
                setPastBuyers(res.data);
            } catch(error) {
                console.error("Error fetching past buyers:", error);
            }
        }

        getPrice();
        getPastBuyers();
    }, [])

    
    const confirmPurchase = async (nft: MarketplaceNFT) => {
        if (!selectedNFT || !wallet){
            toast.error("No NFT selected or wallet not connected.", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true, 
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            return;
        }
        
        setPurchaseStatus('processing');
        
        // Simulate purchase process
        await TradeNft(new PublicKey(nft.Owner), nft.id, wallet!);
        try {
            axios.post('/api/nft/purchaseNft', {
                nftId: nft.id,
                buyer: wallet?.publicKey?.toString(),
                price: nft.AskPrice,
                seller: nft.Owner,
                
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
                    className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl border border-gray-700 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                {/* Modal Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-700">
                    <h2 className="text-2xl font-black text-white">Purchase NFT</h2>
                    <button
                        onClick={() => setShowPurchaseModal()}
                        className="w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded-xl flex items-center justify-center text-gray-400 hover:text-white transition-colors cursor-pointer"
                    >
                    <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Modal Content */}
                <div className="flex p-6">
                    <div className="md:grid-cols-2 mr-8">
                        {/* NFT Image */}
                        <div className="relative">
                            <Image
                                src={selectedNFT.uri}
                                alt={selectedNFT.name}
                                width={450}
                                height={600}
                                className="rounded-2xl"
                            />
                        </div>
                    </div>

                    {/* NFT Details */}
                    <div >
                        <div className="py-6">
                            <h3 className="text-3xl font-black text-white mb-2">
                                {selectedNFT.name}
                            </h3>
                            <p className="text-gray-300 leading-relaxed">
                                {selectedNFT.description}
                            </p>
                        </div>

                            {/* Price Info */}
                            <div className="bg-gray-700/30 rounded-2xl p-6 w-[400px] mb-6">
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
                                    ≈ ${(Number(selectedNFT.AskPrice / LAMPORTS_PER_SOL) * usdPrice).toFixed(2)} USD
                                </div>
                            </div>

                            <div className="bg-gray-700/30 rounded-2xl p-6 mb-6">
                                <div className="flex items-center space-x-2 mb-4">
                                    <User className="w-5 h-5 text-blue-400" />
                                    <h4 className="text-lg font-bold text-white">Past Buyers</h4>
                                </div>
                      
                                {selectedNFT.pastBuyers && selectedNFT.pastBuyers.length > 0 ? (
                                    <div className="space-y-3 max-h-40 overflow-y-auto">
                                        {pastBuyers.map((buyer, index) => (
                                            <div key={index} className="flex items-center justify-between py-2 px-3 bg-gray-600/30 rounded-xl">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full flex items-center justify-center">
                                                        <User className="w-4 h-4 text-white" />
                                                    </div>
                                                    <div>
                                                        <div className="text-white font-medium text-sm">
                                                            {buyer.Buyer}
                                                        </div>
                                                        <div className="flex items-center space-x-1 text-xs text-gray-400">
                                                            <Clock className="w-3 h-3" />
                                                            <span>{new Date(buyer.PurchasedAt).toLocaleDateString()}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-white font-bold text-sm">
                                                        {buyer.price} SOL
                                                    </div>
                                                    <div className="text-xs text-gray-400">
                                                        ${(Number(buyer.price) * usdPrice).toFixed(0)}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    ) : (
                                    <div className="text-center py-4 text-gray-400">
                                        <User className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                        <p>No previous sales recorded</p>
                                    </div>
                                )}
                            </div>

                            {/* Purchase Button */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => confirmPurchase(selectedNFT)}
                                disabled={purchaseStatus === 'processing'}
                                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-4 px-6 rounded-2xl font-bold text-lg flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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