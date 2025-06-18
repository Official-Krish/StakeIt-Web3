"use client"
import { AnimatePresence, motion } from "framer-motion";
import { Coins, Crown, Gem, Sparkles, Star, Image as ImageIcon } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { getPdaAccountData } from "@/hooks/getPdaAccountData";
import axios from "axios";
import { useClaimPonits } from "@/hooks/useClaimPoints";
import { MintNft } from "@/hooks/mintNft";
import { toast } from "react-toastify";
import { nfts } from "@/types/nft";

export const NftList = ( { searchTerm, selectedCategory, viewMode}: { searchTerm: string, selectedCategory: string, viewMode: string } ) => {
    const [showMintAnimation, setShowMintAnimation] = useState<boolean>(false);
    const wallet  = useAnchorWallet();
    const [points, setPoints] = useState<number>(0);
    const [nfts, setNfts] = useState<nfts[]>([]);
    const [getNfts, setGetNfts] = useState<boolean>(false);

    useEffect (() => {
        if (!wallet?.publicKey || getNfts) return;
        getData();
        setGetNfts(true);
    }, [wallet?.publicKey]);

    async function getData() {
        try {
            const data = await getPdaAccountData(wallet!);
            setPoints((data.totalPoints) / 1000); 
            const res = await axios.get("/api/nft/getNfts");
            setNfts(res.data);
        } catch (error) {
            console.error("Data fetch error:", error);
        }
    }

    
    const filteredNFTs = nfts.filter(nft => {
        const matchesCategory = selectedCategory === 'all' || nft.category === selectedCategory;
        const matchesSearch = nft.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            nft.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const handleMint = async (nft: nfts) => {
        setShowMintAnimation(true);
        await useClaimPonits(wallet!, Number(nft.pointPrice))
        await MintNft(wallet!, Number(nft.id), nft.name, nft.basePrice, nft.uri, Number(nft.pointPrice), Number(nft.basePrice))
        const res = await axios.post('/api/nft/mintNft', {
            id: nft.id,
            publicKey: wallet?.publicKey?.toBase58(),
        });
        if (res.status === 200) {
            toast.success(
                `NFT Minted successfully!`,
                {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,     
                    draggable: true,
                    progress: undefined,    
                    theme: "dark",
                }
            );
        } else {
            toast.error(
                `Error minting NFT: ${res.data}`,
                {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,     
                    draggable: true,
                    progress: undefined,    
                    theme: "dark",
                }
            );
        }
        setShowMintAnimation(false);
    };

    return (
        <motion.div
            layout
            className={viewMode === 'grid' 
                ? 'grid md:grid-cols-` lg:grid-cols-2 xl:grid-cols-3 gap-8' 
                : 'space-y-6'
            }
        >
            <AnimatePresence>
                {filteredNFTs.map((nft, index) => {
                    const canAfford = points >= Number(nft.pointPrice);
                    console.log("NFT:", nft);
                    return (
                        <motion.div
                            key={nft.id}
                            layout
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ y: -10, scale: 1.02 }}
                            className={`relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-3xl border border-gray-700/50 backdrop-blur-sm overflow-hidden group ${
                                viewMode === 'list' ? 'flex items-center p-6' : ''
                            }`}
                        >
                            {/* NFT Image */}
                            <div className={`relative ${viewMode === 'list' ? 'w-full h-32 flex-shrink-0' : ''}`}>
                                <Image
                                    src={nft.uri}
                                    alt={nft.name}
                                    className={`object-cover ${
                                        viewMode === 'list' 
                                        ? 'w-full h-full rounded-2xl' 
                                        : 'w-full h-64'
                                    }`}
                                    width={viewMode === 'list' ? 128 : 256}
                                    height={viewMode === 'list' ? 128 : 256}
                                />
                            </div>

                            {/* NFT Info */}
                            <div className={`${viewMode === 'list' ? 'flex-1 ml-6' : 'p-8'}`}>
                                <div className={`${viewMode === 'list' ? 'flex items-center justify-between' : ''}`}>
                                    <div className={viewMode === 'list' ? 'flex-1' : ''}>
                                        <h3 className="text-2xl font-black text-white mb-2">
                                            {nft.name}
                                        </h3>
                                        <p className="text-gray-300 mb-4 line-clamp-2">
                                            {nft.description}
                                        </p>
                                        
                                        <div className={`flex items-center ${viewMode === 'list' ? 'space-x-6' : 'justify-between mb-6'}`}>
                                            <div className="flex items-center space-x-2">
                                                <Coins className="w-5 h-5 text-yellow-400" />
                                                    <span className="text-2xl font-black text-white">
                                                    {nft.pointPrice} Points
                                                </span>
                                            </div>
                                            <div className="text-sm text-gray-400 capitalize bg-gray-700/50 px-3 py-1 rounded-lg">
                                                {nft.category || 'uncategorized'}
                                            </div>
                                        </div>
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        disabled={!canAfford || nft.Minted || nft.Owner === wallet?.publicKey.toBase58()}
                                        className={`${viewMode === 'list' ? 'ml-6' : 'w-full'} py-4 px-6 rounded-2xl font-bold flex items-center justify-center space-x-2 transition-all ${
                                            canAfford || !nft.Minted || nft.Owner != wallet?.publicKey.toBase58()
                                            ? 'bg-gradient-to-r from-pink-600 to-violet-600 text-white hover:shadow-lg cursor-pointer'
                                            : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                        }`}
                                    >
                                        { nft.Owner === wallet?.publicKey.toBase58() ? (
                                            <>
                                                <Crown className="w-5 h-5" />
                                                <span>Owned</span>
                                            </>
                                        ) : (
                                            nft.Minted ? (
                                                <>
                                                    <Star className="w-5 h-5" />
                                                    <span>Sold Out</span>
                                                </>
                                            ) :
                                            canAfford ? (
                                                <>
                                                    <div onClick={() => handleMint(nft)} className="flex items-center space-x-2">
                                                        <Gem className="w-5 h-5" />
                                                        <span>Mint</span>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <Star className="w-5 h-5" />
                                                    <span>Insufficient Points</span>
                                                </>
                                            )
                                        )}
                                        {showMintAnimation && (
                                            <Sparkles className="animate-spin w-5 h-5" />
                                        )}
                                    </motion.button>
                                </div>
                            </div>
                            <AnimatePresence>
                                {showMintAnimation  && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.5 }}
                                        className="absolute inset-0 bg-gradient-to-r from-pink-500/90 to-violet-400/90 flex items-center justify-center rounded-3xl"
                                    >
                                        <div className="text-center">
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        >
                                            <Sparkles className="w-16 h-16 text-white mx-auto mb-4" />
                                        </motion.div>
                                        <div className="text-white font-black text-2xl">
                                            Minting NFT...
                                        </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
            {filteredNFTs.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <ImageIcon className="w-20 h-20 text-gray-600 mx-auto mb-6" />
                        <h3 className="text-3xl font-bold text-gray-400 mb-4">
                            No NFTs Found
                        </h3>
                        <p className="text-gray-500 text-xl">
                            Try adjusting your search or category filters
                        </p>
                    </motion.div>
                )}
        </motion.div>
    )
}