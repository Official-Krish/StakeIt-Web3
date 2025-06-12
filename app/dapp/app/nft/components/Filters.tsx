"use client";
import { motion } from "framer-motion"
import { Grid, List, Search } from "lucide-react"
import { useState } from "react";
import { NftList } from "./NftList";

export default function Filters() {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchTerm, setSearchTerm] = useState('');
    const categories = ['all', 'genesis', 'animals', 'abstract', 'futuristic', 'nature', 'space', 'mythical'];

    const nfts = [
        {
            id: '1',
            name: 'Quantum Genesis',
            description: 'The first NFT in our quantum collection, representing the birth of digital consciousness',
            image: 'https://images.pexels.com/photos/1549200/pexels-photo-1549200.jpeg?auto=compress&cs=tinysrgb&w=800',
            price: 2500,
            rarity: 'legendary',
            category: 'genesis',
        },
        {
            id: '2',
            name: 'Cosmic Leviathan',
            description: 'A majestic space whale traversing the digital cosmos, guardian of the blockchain',
            image: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=800',
            price: 1800,
            rarity: 'epic',
            category: 'animals',
        },
        {
            id: '3',
            name: 'Neural Symphony',
            description: 'Abstract representation of AI consciousness awakening in the digital realm',
            image: 'https://images.pexels.com/photos/1481440/pexels-photo-1481440.jpeg?auto=compress&cs=tinysrgb&w=800',
            price: 1200,
            rarity: 'rare',
            category: 'abstract',
        },
        {
            id: '4',
            name: 'Neon Metropolis',
            description: 'A cyberpunk cityscape where the future of finance comes alive',
            image: 'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=800',
            price: 1500,
            rarity: 'epic',
            category: 'futuristic',
        },
        {
            id: '5',
            name: 'Crystalline Matrix',
            description: 'Perfect geometric formations representing the structure of decentralized networks',
            image: 'https://images.pexels.com/photos/1089455/pexels-photo-1089455.jpeg?auto=compress&cs=tinysrgb&w=800',
            price: 100,
            rarity: 'rare',
            category: 'nature',
        },
        {
            id: '6',
            name: 'Stellar Navigator',
            description: 'Journey through the infinite expanse of the digital galaxy',
            image: 'https://images.pexels.com/photos/586687/pexels-photo-586687.jpeg?auto=compress&cs=tinysrgb&w=800',
            price: 600,
            rarity: 'common',
            category: 'space',
        },
        {
            id: '7',
            name: 'Phoenix Ascendant',
            description: 'Legendary phoenix rising from the ashes of traditional finance',
            image: 'https://images.pexels.com/photos/1161547/pexels-photo-1161547.jpeg?auto=compress&cs=tinysrgb&w=800',
            price: 3200,
            rarity: 'legendary',
            category: 'mythical',
        },
        {
            id: '8',
            name: 'Abyssal Depths',
            description: 'Mysterious depths where digital treasures await discovery',
            image: 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=800',
            price: 950,
            rarity: 'rare',
            category: 'nature',
        },
        {
            id: '9',
            name: 'Cyber Samurai',
            description: 'Ancient warrior code meets cutting-edge technology',
            image: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=800',
            price: 2100,
            rarity: 'epic',
            category: 'futuristic',
        },
        {
            id: '10',
            name: 'Digital Aurora',
            description: 'Breathtaking light phenomena in the digital atmosphere',
            image: 'https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=800',
            price: 1400,
            rarity: 'rare',
            category: 'nature',
        },
    ];


    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12"
            >
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-8 rounded-3xl border border-gray-700/50 backdrop-blur-sm">
                    <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
                        {/* Search */}
                        <div className="relative flex-1 max-w-lg">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search NFTs..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-gray-700/50 border border-gray-600 rounded-2xl pl-9 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                            />
                        </div>

                        {/* Category Filter */}
                        <div className="flex flex-wrap gap-2">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-6 py-3 rounded-xl font-bold capitalize transition-all cursor-pointer ${
                                    selectedCategory === category
                                        ? 'bg-gradient-to-r from-pink-600 to-violet-600 text-white shadow-lg'
                                        : 'bg-gray-700/50 text-gray-300 hover:text-white hover:bg-gray-600/50'
                                    }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>

                        {/* View Mode */}
                        <div className="flex items-center space-x-2 bg-gray-700/30 rounded-xl p-1">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-3 rounded-lg transition-all cursor-pointer ${
                                    viewMode === 'grid'
                                    ? 'bg-pink-600 text-white'
                                    : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                <Grid className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-3 rounded-lg transition-all cursor-pointer ${
                                    viewMode === 'list'
                                    ? 'bg-pink-600 text-white'
                                    : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                <List className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
            <NftList nfts={nfts} searchTerm={searchTerm} selectedCategory={selectedCategory} viewMode={viewMode}/>
        </div>
    )
}