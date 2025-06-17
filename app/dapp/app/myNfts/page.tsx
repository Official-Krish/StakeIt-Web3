import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Images, 
  Search, 
  Grid, 
  List, 
  Calendar,
  Eye,
  Share2,
  Tag,
  X,
  Wallet,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { OwnedNFT } from '@/types/nft';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import axios from 'axios';
import Image from 'next/image';



export default function MyNFTs() {
    const wallet = useAnchorWallet();
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'rarity' | 'name'>('newest');
    const [selectedNFT, setSelectedNFT] = useState<OwnedNFT | null>(null);
    const [showSellModal, setShowSellModal] = useState(false);
    const [sellPrice, setSellPrice] = useState('');
    const [sellStatus, setSellStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
    const categories = ['all', 'genesis', 'abstract', 'nature', 'futuristic', 'mythical', 'animals', 'space'];
    const [nfts, setNfts] = useState<OwnedNFT[]>([]);
    const [getNfts, setGetNfts] = useState<boolean>(false);

    useEffect (() => {
      if (!wallet?.publicKey || getNfts) return;
      getData();
      setGetNfts(true);
    }, [wallet?.publicKey]);

    async function getData() {
      try {
          const res = await axios.get("/api/nft/ownedNfts", {
              params: {
                MintedBy: wallet?.publicKey?.toBase58(),
              },
          });
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
          case 'newest':
            return new Date(b.MintedAt).getTime() - new Date(a.MintedAt).getTime();
          case 'oldest':
            return new Date(a.MintedAt).getTime() - new Date(b.MintedAt).getTime();
          case 'name':
            return a.name.localeCompare(b.name);
          default:
            return 0;
        }
      });

    const handleSell = (nft: OwnedNFT) => {
      setSelectedNFT(nft);
      setShowSellModal(true);
      setSellStatus('idle');
      setSellPrice(nft.lastSalePrice?.toString() || '');
    };

    const confirmSell = async () => {
      if (!selectedNFT || !sellPrice) return;
      
      setSellStatus('processing');
      
      // Simulate listing process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSellStatus('success');
      setTimeout(() => {
        setShowSellModal(false);
        setSelectedNFT(null);
        setSellStatus('idle');
        setSellPrice('');
      }, 2000);
    };

    return (
      <div className="min-h-screen bg-black pt-20 pb-12">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 to-emerald-900/20" />
            <div className="absolute inset-0 opacity-10">
              <Image
                src="https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg?auto=compress&cs=tinysrgb&w=1600"
                alt="Background"
                className="w-full h-full object-cover"
              />
            </div>
          
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
              >
                <h1 className="text-6xl font-black text-white mb-6">
                  My <span className="text-green-400">NFT Collection</span>
                </h1>
                <p className="text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
                  Manage, showcase, and trade your exclusive digital assets
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
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search your collection..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-gray-700/50 border border-gray-600 rounded-2xl pl-12 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  {/* Filters */}
                  <div className="flex flex-wrap gap-4">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
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
                      className="bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="rarity">By Rarity</option>
                      <option value="name">By Name</option>
                    </select>
                  </div>

                  {/* View Mode */}
                  <div className="flex items-center space-x-2 bg-gray-700/30 rounded-xl p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-3 rounded-lg transition-all ${
                        viewMode === 'grid'
                          ? 'bg-green-600 text-white'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      <Grid className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-3 rounded-lg transition-all ${
                        viewMode === 'list'
                          ? 'bg-green-600 text-white'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      <List className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

          {/* NFT Collection */}
          {filteredAndSortedNFTs.length > 0 ? (
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
                      className={`relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-3xl border border-gray-700/50 backdrop-blur-sm overflow-hidden group ${
                        viewMode === 'list' ? 'flex items-center p-6' : ''
                      }`}
                    >
                      {/* NFT Image */}
                      <div className={`relative ${viewMode === 'list' ? 'w-32 h-32 flex-shrink-0' : ''}`}>
                        <img
                          src={nft.uri}
                          alt={nft.name}
                          className={`object-cover ${
                            viewMode === 'list' 
                              ? 'w-full h-full rounded-2xl' 
                              : 'w-full h-64'
                          }`}
                        />

                        {/* Listed Badge */}
                        {nft.Listed && (
                          <div className="absolute top-3 left-3 bg-green-600 text-white px-3 py-1 rounded-xl text-sm font-bold flex items-center space-x-1">
                            <Tag className="w-4 h-4" />
                            <span>LISTED</span>
                          </div>
                        )}

                        {/* Hover Actions */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                          >
                            <Eye className="w-5 h-5" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                          >
                            <Share2 className="w-5 h-5" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleSell(nft)}
                            className="w-12 h-12 bg-green-600/80 backdrop-blur-sm rounded-xl flex items-center justify-center text-white hover:bg-green-600 transition-colors"
                          >
                            <Tag className="w-5 h-5" />
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
                            <p className="text-gray-300 mb-4 line-clamp-2">
                              {nft.description}
                            </p>
                            
                            <div className={`flex items-center ${viewMode === 'list' ? 'space-x-6' : 'justify-between mb-4'}`}>
                              <div className="text-sm text-gray-400 capitalize bg-gray-700/50 px-3 py-1 rounded-lg">
                                {nft.category}
                              </div>
                              <div className="flex items-center space-x-2 text-gray-400">
                                <Calendar className="w-4 h-4" />
                                <span className="text-sm">
                                  {new Date(nft.MintedAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between mb-4">
                              {nft.lastSalePrice && (
                                <div className="text-right">
                                  <div className="text-xs text-gray-400">Last Sale</div>
                                  <div className="text-lg font-bold text-white flex items-center space-x-1">
                                    <Wallet className="w-4 h-4 text-cyan-400" />
                                    <span>{nft.lastSalePrice} SOL</span>
                                  </div>
                                </div>
                              )}
                            </div>

                            {nft.Listed && nft.AskPrice && (
                              <div className="bg-green-900/20 border border-green-700/30 rounded-xl p-3">
                                <div className="text-green-400 text-sm font-medium mb-1">Listed Price</div>
                                <div className="text-xl font-black text-white flex items-center space-x-2">
                                  <Wallet className="w-5 h-5 text-green-400" />
                                  <span>{nft.AskPrice} SOL</span>
                                </div>
                              </div>
                            )}
                          </div>

                          {viewMode === 'list' && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleSell(nft)}
                              className="ml-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-bold flex items-center space-x-2"
                            >
                              <Tag className="w-5 h-5" />
                              <span>{nft.Listed ? 'Update Listing' : 'List for Sale'}</span>
                            </motion.button>
                          )}
                        </div>

                        {viewMode === 'grid' && (
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleSell(nft)}
                            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 rounded-xl font-bold flex items-center justify-center space-x-2"
                          >
                            <Tag className="w-5 h-5" />
                            <span>{nft.Listed ? 'Update Listing' : 'List for Sale'}</span>
                          </motion.button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <Images className="w-20 h-20 text-gray-600 mx-auto mb-6" />
              <h3 className="text-3xl font-bold text-gray-400 mb-4">
                {nfts.length === 0 ? 'No NFTs in Collection' : 'No NFTs Found'}
              </h3>
              <p className="text-gray-500 text-xl mb-8">
                {nfts.length === 0 
                  ? 'Start collecting NFTs to build your portfolio' 
                  : 'Try adjusting your search or filter criteria'
                }
              </p>
              {nfts.length === 0 && (
                <motion.a
                  href="/marketplace"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-2xl font-bold text-lg"
                >
                  <Images className="w-5 h-5" />
                  <span>Explore Marketplace</span>
                </motion.a>
              )}
            </motion.div>
          )}
        </div>

        {/* Sell Modal */}
        <AnimatePresence>
          {showSellModal && selectedNFT && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setShowSellModal(false)}
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
                  <h2 className="text-2xl font-black text-white">
                    {selectedNFT.Listed ? 'Update Listing' : 'List NFT for Sale'}
                  </h2>
                  <button
                    onClick={() => setShowSellModal(false)}
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
                      <img
                        src={selectedNFT.uri}
                        alt={selectedNFT.name}
                        className="w-full h-80 object-cover rounded-2xl"
                      />
                    </div>

                    {/* NFT Details & Pricing */}
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-3xl font-black text-white mb-2">
                          {selectedNFT.name}
                        </h3>
                        <p className="text-gray-300 leading-relaxed">
                          {selectedNFT.description}
                        </p>
                      </div>

                      {/* Current Status */}
                      {selectedNFT.Listed && (
                        <div className="bg-green-900/20 border border-green-700/30 rounded-2xl p-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <Tag className="w-5 h-5 text-green-400" />
                            <span className="text-green-400 font-bold">Currently Listed</span>
                          </div>
                          <div className="text-2xl font-black text-white">
                            {selectedNFT.AskPrice} SOL
                          </div>
                        </div>
                      )}

                      {/* Price History */}
                      {selectedNFT.lastSalePrice && (
                        <div className="bg-gray-700/30 rounded-2xl p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-400">Last Sale Price</span>
                            <div className="flex items-center space-x-2">
                              <Wallet className="w-4 h-4 text-cyan-400" />
                              <span className="text-lg font-bold text-white">
                                {selectedNFT.lastSalePrice} SOL
                              </span>
                            </div>
                          </div>
                          <div className="text-sm text-gray-400">
                            ≈ ${(Number(selectedNFT.lastSalePrice) * 180).toFixed(2)} USD
                          </div>
                        </div>
                      )}

                      {/* Pricing Input */}
                      <div className="space-y-4">
                        <label className="block text-lg font-bold text-white">
                          Set Your Price
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            value={sellPrice}
                            onChange={(e) => setSellPrice(e.target.value)}
                            placeholder="0.00"
                            step="0.1"
                            min="0"
                            className="w-full bg-gray-700/50 border-2 border-gray-600 rounded-2xl px-6 py-4 text-white text-xl font-bold focus:outline-none focus:ring-4 focus:ring-green-500/50 focus:border-green-500 transition-all"
                          />
                          <div className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg font-bold">
                            SOL
                          </div>
                        </div>
                        {sellPrice && (
                          <div className="text-sm text-gray-400">
                            ≈ ${(parseFloat(sellPrice) * 180).toFixed(2)} USD
                          </div>
                        )}
                      </div>

                      {/* Quick Price Suggestions */}
                      <div className="grid grid-cols-3 gap-3">
                        {selectedNFT.lastSalePrice && [
                          { label: '-10%', value: Number(selectedNFT.lastSalePrice )* 0.9 },
                          { label: 'Last Sale', value: selectedNFT.lastSalePrice },
                          { label: '+20%', value: Number(selectedNFT.lastSalePrice) * 1.2 },
                        ].map((suggestion) => (
                          <motion.button
                            key={suggestion.label}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSellPrice(Number(suggestion.value).toFixed(1))}
                            className="py-2 px-3 bg-gray-700/30 hover:bg-gray-600/50 text-gray-300 hover:text-white rounded-xl font-bold transition-all border border-gray-600/50 hover:border-green-500/50"
                          >
                            <div className="text-xs text-gray-400">{suggestion.label}</div>
                            <div className="text-sm">{Number(suggestion.value).toFixed(1)} SOL</div>
                          </motion.button>
                        ))}
                      </div>

                      {/* List Button */}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={confirmSell}
                        disabled={!sellPrice || parseFloat(sellPrice) <= 0 || sellStatus === 'processing'}
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-6 rounded-2xl font-bold text-lg flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {sellStatus === 'processing' ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                            />
                            <span>Processing...</span>
                          </>
                        ) : sellStatus === 'success' ? (
                          <>
                            <CheckCircle className="w-5 h-5" />
                            <span>Listed Successfully!</span>
                          </>
                        ) : sellStatus === 'error' ? (
                          <>
                            <AlertCircle className="w-5 h-5" />
                            <span>Listing Failed</span>
                          </>
                        ) : (
                          <>
                            <Tag className="w-5 h-5" />
                            <span>
                              {selectedNFT.Listed ? 'Update Listing' : `List for ${sellPrice || '0'} SOL`}
                            </span>
                          </>
                        )}
                      </motion.button>

                      {/* Fees Info */}
                      <div className="bg-blue-900/20 border border-blue-700/30 rounded-2xl p-4">
                        <h4 className="text-blue-400 font-bold mb-3">💡 Listing Information</h4>
                        <ul className="text-gray-300 space-y-1 text-sm">
                          <li>• Platform fee: 2.5% of sale price</li>
                          <li>• Creator royalty: 5% of sale price</li>
                          <li>• You'll receive: 92.5% of sale price</li>
                          <li>• Free to list, fees only on successful sale</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
};
