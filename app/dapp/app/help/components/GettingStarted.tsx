"use client";
import { motion } from 'framer-motion';
import { ChevronRight, Image, Play, Zap } from 'lucide-react';

interface GettingStartedProps {
    setActiveSection: (value:  'staking' | 'nfts') => void;
}

export default function GettingStarted({ setActiveSection }: GettingStartedProps) {
    return (
        <motion.div
            key="getting-started"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
        >
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-8 rounded-3xl border border-gray-700/50 backdrop-blur-sm">
                <h2 className="text-3xl font-bold text-white mb-6">Welcome to StakeIT!</h2>
                <p className="text-gray-300 text-lg leading-relaxed mb-8">
                    SolanaStake is a next-generation DeFi platform where you can stake SOL tokens to earn points, 
                    which can be used to mint exclusive NFTs or trade in our marketplace.
                </p>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-blue-900/20 border border-blue-700/30 rounded-2xl p-6">
                        <div className="flex items-center space-x-3 mb-4">
                            <Zap className="w-8 h-8 text-blue-400" />
                            <h4 className="text-xl font-bold text-white">Staking</h4>
                        </div>
                        <p className="text-gray-300 mb-4">
                            Stake your SOL tokens to earn points continuously. The more you stake, the faster you earn!
                        </p>
                        <button
                            onClick={() => setActiveSection('staking')}
                            className="text-blue-400 hover:text-blue-300 font-semibold flex items-center space-x-1"
                        >
                            <span className='cursor-pointer'>Learn More</span>
                            <ChevronRight className="w-4 h-4" />
                        </button>
                        </div>

                        <div className="bg-pink-900/20 border border-pink-700/30 rounded-2xl p-6">
                        <div className="flex items-center space-x-3 mb-4">
                            <Image className="w-8 h-8 text-pink-400" />
                            <h4 className="text-xl font-bold text-white">NFTs</h4>
                        </div>
                        <p className="text-gray-300 mb-4">
                            Use your earned points to mint exclusive NFTs or trade them in our marketplace.
                        </p>
                        <button
                            onClick={() => setActiveSection('nfts')}
                            className="text-pink-400 hover:text-pink-300 font-semibold flex items-center space-x-1 cursor-pointer"
                        >
                            <span>Learn More</span>
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-700/30 rounded-2xl p-6">
                    <h4 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                    <Play className="w-6 h-6 text-green-400" />
                    <span>Quick Start Guide</span>
                    </h4>
                    <ol className="space-y-3 text-gray-300">
                    <li className="flex items-start space-x-3">
                        <span className="bg-green-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">1</span>
                        <span>Connect your Solana wallet to the platform</span>
                    </li>
                    <li className="flex items-start space-x-3">
                        <span className="bg-green-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">2</span>
                        <span>Stake some SOL to start earning points automatically</span>
                    </li>
                    <li className="flex items-start space-x-3">
                        <span className="bg-green-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">3</span>
                        <span>Browse NFTs and mint your favorites with earned points</span>
                    </li>
                    <li className="flex items-start space-x-3">
                        <span className="bg-green-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">4</span>
                        <span>Trade NFTs in the marketplace for SOL</span>
                    </li>
                    </ol>
                </div>
            </div>
        </motion.div>
    )
}