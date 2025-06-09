"use client"
import { AnimatePresence, motion } from "framer-motion";
import { Gift, Wallet, Zap } from "lucide-react";
import { useState } from "react";


export default function Staking () {
    const [activeTab, setActiveTab] = useState<'stake' | 'unstake'>('stake');
    const [stakeAmount, setStakeAmount] = useState('');
    const [unstakeAmount, setUnstakeAmount] = useState('');
    const [showClaimAnimation, setShowClaimAnimation] = useState(false);

    const handleStake = () => {
        console.log("Staked SOL")
    };

    const handleUnstake = () => {
        console.log("Unstaked SOL")
    };

    const user = {
        stakedSol: 1,
        availablePoints: 1
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2"
        >
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-10 rounded-3xl border border-gray-700/50 backdrop-blur-sm">
                {/* Enhanced Tab Navigation */}
                <div className="flex space-x-2 bg-gray-700/30 rounded-2xl p-2 mb-10">
                    {[
                    { key: 'stake', label: 'Stake SOL', icon: Zap },
                    { key: 'unstake', label: 'Unstake SOL', icon: Wallet },
                    ].map((tab) => {
                    const Icon = tab.icon;
                        return (
                            <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key as 'stake' | 'unstake')}
                            className={`flex-1 py-4 px-6 rounded-xl font-bold transition-all flex items-center justify-center space-x-2 ${
                                activeTab === tab.key
                                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                                : 'text-gray-300 hover:text-white hover:bg-gray-600/30'
                            }`}
                            >
                            <Icon className="w-5 h-5" />
                            <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === 'stake' && (
                        <motion.div
                            key="stake"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-white mb-2">Stake Your SOL</h2>
                                <p className="text-gray-400">Start earning rewards immediately</p>
                            </div>

                            <div className="relative">
                                <label className="block text-lg font-bold text-gray-300 mb-4">
                                    Amount to Stake
                                </label>
                                <div className="relative">
                                    <input
                                    type="number"
                                    value={stakeAmount}
                                    onChange={(e) => setStakeAmount(e.target.value)}
                                    placeholder="0.00"
                                    className="w-full bg-gray-700/50 border-2 border-gray-600 rounded-2xl px-6 py-6 text-white text-2xl font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                                    />
                                    <div className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl font-bold">
                                    SOL
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-4 gap-3">
                                {[1, 5, 10, 25].map((amount) => (
                                    <motion.button
                                    key={amount}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setStakeAmount(amount.toString())}
                                    className="py-3 px-4 bg-gray-700/30 hover:bg-gray-600/50 text-gray-300 hover:text-white rounded-xl font-bold transition-all border border-gray-600/50 hover:border-blue-500/50"
                                    >
                                    {amount} SOL
                                    </motion.button>
                                ))}
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02, boxShadow: '0 20px 40px rgba(59, 130, 246, 0.3)' }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleStake}
                                disabled={!stakeAmount || parseFloat(stakeAmount) <= 0}
                                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-6 px-8 rounded-2xl font-bold text-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 shadow-2xl"
                                >
                                <Zap className="w-6 h-6" />
                                <span>Stake {stakeAmount || '0'} SOL</span>
                            </motion.button>

                            <div className="bg-blue-900/20 border border-blue-700/30 rounded-2xl p-6">
                                <h4 className="text-blue-400 font-bold mb-3">💡 Staking Benefits</h4>
                                <ul className="text-gray-300 space-y-2">
                                    <li>• Earn 0.1 points per SOL per second</li>
                                    <li>• No minimum staking period</li>
                                    <li>• Compound your rewards automatically</li>
                                    <li>• Access to exclusive NFT drops</li>
                                </ul>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'unstake' && (
                        <motion.div
                            key="unstake"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-white mb-2">Unstake Your SOL</h2>
                                <p className="text-gray-400">Withdraw your staked tokens</p>
                            </div>

                            <div className="relative">
                                <label className="block text-lg font-bold text-gray-300 mb-4">
                                    Amount to Unstake
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={unstakeAmount}
                                        onChange={(e) => setUnstakeAmount(e.target.value)}
                                        placeholder="0.00"
                                        max={user.stakedSol}
                                        className="w-full bg-gray-700/50 border-2 border-gray-600 rounded-2xl px-6 py-6 text-white text-2xl font-bold focus:outline-none focus:ring-4 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                                    />
                                    <div className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl font-bold">
                                        SOL
                                    </div>
                                </div>
                                <div className="text-gray-400 mt-2 text-lg">
                                    Available: <span className="text-white font-bold">{user.stakedSol.toFixed(2)} SOL</span>
                                </div>
                            </div>

                            <div className="flex space-x-4">
                                <button
                                    onClick={() => setUnstakeAmount((user.stakedSol * 0.25).toString())}
                                    className="flex-1 py-3 bg-gray-700/30 hover:bg-gray-600/50 text-gray-300 hover:text-white rounded-xl font-bold transition-all"
                                >
                                    25%
                                </button>
                                <button
                                    onClick={() => setUnstakeAmount((user.stakedSol * 0.5).toString())}
                                    className="flex-1 py-3 bg-gray-700/30 hover:bg-gray-600/50 text-gray-300 hover:text-white rounded-xl font-bold transition-all"
                                >
                                    50%
                                </button>
                                <button
                                    onClick={() => setUnstakeAmount((user.stakedSol * 0.75).toString())}
                                    className="flex-1 py-3 bg-gray-700/30 hover:bg-gray-600/50 text-gray-300 hover:text-white rounded-xl font-bold transition-all"
                                >
                                    75%
                                </button>
                                <button
                                    onClick={() => setUnstakeAmount(user.stakedSol.toString())}
                                    className="flex-1 py-3 bg-gray-700/30 hover:bg-gray-600/50 text-gray-300 hover:text-white rounded-xl font-bold transition-all"
                                >
                                    MAX
                                </button>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleUnstake}
                                disabled={
                                    !unstakeAmount || 
                                    parseFloat(unstakeAmount) <= 0 || 
                                    parseFloat(unstakeAmount) > user.stakedSol
                                }
                                className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-6 px-8 rounded-2xl font-bold text-xl disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Unstake {unstakeAmount || '0'} SOL
                            </motion.button>

                            <div className="bg-orange-900/20 border border-orange-700/30 rounded-2xl p-6">
                                <h4 className="text-orange-400 font-bold mb-3">⚠️ Unstaking Notice</h4>
                                <p className="text-orange-300">
                                    Unstaking will immediately stop earning rewards on the withdrawn amount. 
                                    You can restake anytime to resume earning.
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <AnimatePresence>
                {showClaimAnimation && (
                    <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
                    >
                    <div className="bg-gradient-to-r from-green-500 to-emerald-400 text-white px-12 py-8 rounded-3xl shadow-2xl">
                        <div className="flex items-center space-x-4">
                        <Gift className="w-8 h-8" />
                        <span className="text-2xl font-black">Points Claimed Successfully!</span>
                        </div>
                    </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}