"use client";
import { motion, AnimatePresence } from 'framer-motion';
import { Grid, Heart, List, Search, ShoppingBag, Wallet } from 'lucide-react';
import { MarketplaceNFT } from '@/types/nft';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { PurchaseModal } from './PurchaseModal';
import { toast } from 'react-toastify';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

export function Hero() {
    const wallet = useAnchorWallet();
    const [nfts, setNfts] = useState<MarketplaceNFT[]>([]);
    const [getNfts, setGetNfts] = useState<boolean>(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchTerm, setSearchTerm] = useState('');
    const [showPurchaseModal, setShowPurchaseModal] = useState(false); 
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [sortBy, setSortBy] = useState<'price_low' | 'price_high' | 'newest' >('newest');
    const categories = ['All', 'Genesis', 'Animals', 'Abstract', 'Futuristic', 'Nature', 'Space', 'Mythical'];

    const [selectedNFT, setSelectedNFT] = useState<MarketplaceNFT | null>(null);

    useEffect (() => {
        if (!wallet?.publicKey || getNfts) return;
        getData();
        setGetNfts(true);
    }, [wallet?.publicKey]);

    async function getData() {
        try {
            const res = await axios.get("/api/nft/marketplace");
            if (res.data.length === 0) {
                toast.info("No NFTs found in the marketplace.", {
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
            setNfts(res.data);
        } catch (error) {
            console.error("Data fetch error:", error);
        }
    }

    const filteredAndSortedNFTs = nfts
        .filter(nft => {
        const matchesSearch = nft.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            nft.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || nft.category === selectedCategory;
        return matchesSearch && matchesCategory;
        })
        .sort((a, b) => {
        switch (sortBy) {
            case 'price_low':
                return Number(a.AskPrice) - Number(b.AskPrice);
            case 'price_high':
                return Number(b.AskPrice) - Number(a.AskPrice);
            case 'newest':
                default:
            return 0;
        }
    });
    return (
        <div>
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-cyan-900/20" />
                    <div className="absolute inset-0 opacity-10">
                        <img
                            src="https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg?auto=compress&cs=tinysrgb&w=1600"
                            alt="Background"
                            className="w-full h-full object-cover"
                            width={1920}
                            height={1080}
                        />
                    </div>
                
                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center mb-12"
                        >
                            <h1 className="text-6xl font-black text-white mb-6">
                                NFT <span className="text-cyan-400">Marketplace</span>
                            </h1>
                            <p className="text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
                                Discover, collect, and trade extraordinary digital assets
                            </p>
                        </motion.div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Enhanced Filters */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-12"
                    >
                        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-8 rounded-3xl border border-gray-700/50 backdrop-blur-sm">
                            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
                                {/* Search */}
                                <div className="relative flex-1 max-w-md cursor-pointer">
                                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        placeholder="Search NFTs..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full bg-gray-700/50 border border-gray-600 rounded-2xl pl-12 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                    />
                                </div>

                                {/* Filters */}
                                <div className="flex flex-wrap gap-4 cursor-pointer">
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer"
                                    >
                                        {categories.map(category => (
                                            <option key={category} value={category} className="capitalize">
                                                {category}
                                            </option>
                                        ))}
                                    </select>

                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value as any)}
                                        className="bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer"
                                    >
                                        <option value="newest">Newest</option>
                                        <option value="price_low">Price: Low to High</option>
                                        <option value="price_high">Price: High to Low</option>
                                        <option value="popular">Most Popular</option>
                                    </select>
                                </div>

                                {/* View Mode */}
                                <div className="flex items-center space-x-2 bg-gray-700/30 rounded-xl p-1">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-3 rounded-lg transition-all cursor-pointer ${
                                            viewMode === 'grid'
                                            ? 'bg-cyan-600 text-white'
                                            : 'text-gray-400 hover:text-white'
                                        }`}
                                    >
                                        <Grid className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-3 rounded-lg transition-all cursor-pointer ${
                                            viewMode === 'list'
                                            ? 'bg-cyan-600 text-white'
                                            : 'text-gray-400 hover:text-white'
                                        }`}
                                    >
                                        <List className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                {/* NFT Grid */}
                <motion.div
                    layout
                    className={viewMode === 'grid' 
                        ? 'grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8' 
                        : 'space-y-6'
                    }
                >
                    <AnimatePresence>
                        {filteredAndSortedNFTs.map((nft, index) => {
                        
                            return (
                                <motion.div
                                    key={nft.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ delay: index * 0.05 }}
                                    whileHover={{ y: -10, scale: 1.02 }}
                                    className={`relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-3xl border border-gray-700/50 backdrop-blur-sm overflow-hidden group cursor-pointer ${
                                        viewMode === 'list' ? 'flex items-center p-6' : ''
                                    }`}
                                    onClick={() => {
                                        setSelectedNFT(nft);
                                        setShowPurchaseModal(true);
                                    }}
                                >
                                {/* NFT Image */}
                                <div className={`relative ${viewMode === 'list' ? 'w-32 h-32 flex-shrink-0' : ''}`}>
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

                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            className="bg-cyan-600 text-white px-6 py-3 rounded-xl font-bold flex items-center space-x-2 cursor-pointer"
                                        >
                                            <ShoppingBag className="w-5 h-5" />
                                            <span>Buy</span>
                                        </motion.button>
                                    </div>
                                </div>

                                {/* NFT Info */}
                                <div className={`${viewMode === 'list' ? 'flex-1 ml-6' : 'p-6'}`}>
                                    <div className={`${viewMode === 'list' ? 'flex items-center justify-between' : ''}`}>
                                        <div className={viewMode === 'list' ? 'flex-1' : ''}>
                                            <h3 className="text-xl font-black text-white mb-2">
                                                {nft.name}
                                            </h3>
                                            <div className={`flex items-center ${viewMode === 'list' ? 'space-x-6' : 'justify-between mb-4'}`}>
                                                <div className="flex items-center space-x-2">
                                                    <Wallet className="w-4 h-4 text-cyan-400" />
                                                    <span className="text-lg font-black text-white">
                                                    {Number(nft.AskPrice) / LAMPORTS_PER_SOL} SOL
                                                    </span>
                                                </div>
                                                <div className="text-sm text-gray-400 capitalize bg-gray-700/50 px-2 py-1 rounded-lg">
                                                    {nft.category}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </motion.div>
            </div>
            {showPurchaseModal && selectedNFT && (
                <PurchaseModal selectedNFT={selectedNFT} setShowPurchaseModal={() => setShowPurchaseModal(false)} setSelectedNFT={() => null}/>
            )}
        </div>
    )
}