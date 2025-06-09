"use client"
import { AnimatePresence, motion } from "framer-motion";
import { Coins, Crown, Gem, Sparkles, Star, Image } from "lucide-react";
import { useState } from "react";

export const NftList = ( {nfts, searchTerm, selectedCategory, viewMode}: { nfts: any[], searchTerm: string, selectedCategory: string, viewMode: string } ) => {
    const [mintedNFTs, setMintedNFTs] = useState<string[]>([]);
    const [showMintAnimation, setShowMintAnimation] = useState<string | null>(null);
    
    const filteredNFTs = nfts.filter(nft => {
        const matchesCategory = selectedCategory === 'all' || nft.category === selectedCategory;
        const matchesSearch = nft.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            nft.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const getRarityIcon = (rarity: string) => {
        switch (rarity) {
        case 'legendary': return Crown;
        case 'epic': return Gem;
        case 'rare': return Star;
        default: return Sparkles;
        }
    };

    const getRarityColor = (rarity: string) => {
        switch (rarity) {
        case 'legendary': return 'from-yellow-400 to-orange-500';
        case 'epic': return 'from-violet-400 to-pink-500';
        case 'rare': return 'from-blue-400 to-cyan-500';
        default: return 'from-gray-400 to-gray-500';
        }
    };

    const handleMint = (nft: any) => {
        setMintedNFTs([...mintedNFTs, nft.id]);
        setShowMintAnimation(nft.id);
        setTimeout(() => setShowMintAnimation(null), 2000);
    };

    const user = {
        stakedSol: 1,
        availablePoints: 1
    }

    return (
        <motion.div
            layout
            className={viewMode === 'grid' 
                ? 'grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8' 
                : 'space-y-6'
            }
        >
            <AnimatePresence>
                {filteredNFTs.map((nft, index) => {
                    const RarityIcon = getRarityIcon(nft.rarity);
                    const isMinted = mintedNFTs.includes(nft.id);
                    const canAfford = user.availablePoints >= nft.price;
                
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
                            <div className={`relative ${viewMode === 'list' ? 'w-32 h-32 flex-shrink-0' : ''}`}>
                                <img
                                    src={nft.image}
                                    alt={nft.name}
                                    className={`object-cover ${
                                        viewMode === 'list' 
                                        ? 'w-full h-full rounded-2xl' 
                                        : 'w-full h-64'
                                    }`}
                                />
                                <div className={`absolute top-3 right-3 px-3 py-1 rounded-xl bg-gradient-to-r ${getRarityColor(nft.rarity)} flex items-center space-x-1`}>
                                    <RarityIcon className="w-4 h-4 text-white" />
                                    <span className="text-sm font-bold text-white capitalize">
                                        {nft.rarity}
                                    </span>
                                </div>
                                {isMinted && (
                                    <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center rounded-2xl">
                                        <div className="bg-green-500 text-white px-4 py-2 rounded-xl font-bold">
                                        OWNED
                                        </div>
                                    </div>
                                )}
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
                                                {nft.price.toLocaleString()}
                                                </span>
                                            </div>
                                            <div className="text-sm text-gray-400 capitalize bg-gray-700/50 px-3 py-1 rounded-lg">
                                                {nft.category}
                                            </div>
                                        </div>
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleMint(nft)}
                                        disabled={!canAfford || isMinted}
                                        className={`${viewMode === 'list' ? 'ml-6' : 'w-full'} py-4 px-6 rounded-2xl font-bold flex items-center justify-center space-x-2 transition-all ${
                                        isMinted
                                            ? 'bg-green-600 text-white cursor-default'
                                            : canAfford
                                            ? 'bg-gradient-to-r from-pink-600 to-violet-600 text-white hover:shadow-lg'
                                            : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                        }`}
                                    >
                                        <Image className="w-5 h-5"/>
                                        <span>
                                            {isMinted ? 'Owned' : canAfford ? 'Mint NFT' : 'Insufficient Points'}
                                        </span>
                                    </motion.button>
                                </div>
                            </div>

                            {/* Mint Animation */}
                            <AnimatePresence>
                                {showMintAnimation === nft.id && (
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
                        <Image className="w-20 h-20 text-gray-600 mx-auto mb-6" />
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