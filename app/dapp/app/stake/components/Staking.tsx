"use client"
import { getPdaAccountData } from "@/hooks/Staking";
import { StakeSol } from "@/hooks/Staking";
import { UnstakeTokens } from "@/hooks/Staking";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { Connection } from "@solana/web3.js";
import { AnimatePresence, motion } from "framer-motion";
import { Gift, Loader2, Wallet, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";


export default function Staking () {
    const wallet = useAnchorWallet();
    const [activeTab, setActiveTab] = useState<'stake' | 'unstake'>('stake');
    const [stakeAmount, setStakeAmount] = useState('');
    const [unstakeAmount, setUnstakeAmount] = useState('');
    const [stakedAmount, setStakedAmount] = useState(0);

    useEffect(() => {
        if (!wallet?.publicKey) return;
        getData();
    }, [wallet?.publicKey]);

    async function getData() {
        try {
            const data = await getPdaAccountData(wallet!);
            setStakedAmount(data.stakedAmount / 1e9);
        } catch (error) {
            console.error("Data fetch error:", error);
        }
    }

    if (!wallet) {
        return (
            <div className="text-center text-gray-400">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Connecting...</h2>
            </div>
        );
    }

    const handleStake = async () => {
        const connection = new Connection("https://api.devnet.solana.com");

        const balance = await connection.getBalance(wallet?.publicKey);
        
        if (balance < Number(stakeAmount) * 1e9 ) {
            toast.error(
                "Insufficient balance to stake this amount.",
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
            )
            return;
        }
        const res = await StakeSol(wallet, parseFloat(stakeAmount));
        if (res.success){
            toast.success(
                `Successfully staked ${stakeAmount} SOL!`,
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
            setStakeAmount('');
            window.location.reload();
        } else {
            toast.error(
                `Failed to stake SOL: ${res.message}`,
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

    };

    const handleUnstake = async () => {
        const res = await UnstakeTokens(wallet, parseFloat(unstakeAmount))
        if (res.success) {
            toast.success(
                `Successfully unstaked ${unstakeAmount} SOL!`,
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
            setUnstakeAmount('');
            window.location.reload();
        }
        else {
            toast.error(
                `Failed to unstake SOL: ${res.message}`,
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
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2"
        >
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 px-6 py-4 rounded-2xl border border-gray-700/50 backdrop-blur-sm mb-4">
                {/* Enhanced Tab Navigation */}
                <div className="flex space-x-2 bg-gray-700/30 rounded-2xl p-2 mb-6">
                    {[
                    { key: 'stake', label: 'Stake SOL', icon: Zap },
                    { key: 'unstake', label: 'Unstake SOL', icon: Wallet },
                    ].map((tab) => {
                    const Icon = tab.icon;
                        return (
                            <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key as 'stake' | 'unstake')}
                            className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all flex items-center justify-center space-x-2  cursor-pointer ${
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
                            className="space-y-6"
                        >
                            <div className="text-center mb-6">
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
                                        className="w-full bg-gray-700/50 border-2 border-gray-600 rounded-2xl px-6 py-4 text-white text-xl font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
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
                                        className="py-3 px-4 bg-gray-700/30 hover:bg-gray-600/50 text-gray-300 hover:text-white rounded-xl font-bold transition-all border border-gray-600/50 hover:border-blue-500/50  cursor-pointer"
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
                                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 px-6 rounded-2xl font-bold text-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 shadow-2xl cursor-pointer"
                            >
                                <Zap className="w-6 h-6" />
                                <span>Stake {stakeAmount || '0'} SOL</span>
                            </motion.button>

                            <div className="bg-blue-900/20 border border-blue-700/30 rounded-2xl p-4 mb-4">
                                <h4 className="text-blue-400 font-bold mb-3">💡 
                                    Staking Benefits
                                </h4>
                                <ul className="text-gray-300 space-y-2">
                                    <li>• Earn 0.1 points per SOL per second</li>
                                    <li>• Earn 7% apy on staked SOL</li>
                                    <li>• No minimum staking period</li>
                                    <li>• Compound your rewards automatically</li>
                                    <li>• Access to exclusive NFT drops</li>
                                    <li>• Accumulated Rewards will be transferred to your account when you unstake.</li>
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
                            <div className="text-center mb-6">
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
                                        max={stakedAmount}
                                        className="w-full bg-gray-700/50 border-2 border-gray-600 rounded-2xl px-4 py-3 text-white text-2xl font-bold focus:outline-none focus:ring-4 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                                    />
                                    <div className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl font-bold">
                                        SOL
                                    </div>
                                </div>
                                <div className="text-gray-400 mt-3 text-lg">
                                    Available SOL to unstake: <span className="text-white font-bold">{stakedAmount.toString()}</span>
                                </div>
                            </div>

                            <div className="flex space-x-4">
                                <button
                                    onClick={() => setUnstakeAmount((stakedAmount * 0.25).toString())}
                                    className="flex-1 py-3 bg-gray-700/30 hover:bg-gray-600/50 text-gray-300 hover:text-white rounded-xl font-bold transition-all cursor-pointer"
                                >
                                    25%
                                </button>
                                <button
                                    onClick={() => setUnstakeAmount((stakedAmount * 0.5).toString())}
                                    className="flex-1 py-3 bg-gray-700/30 hover:bg-gray-600/50 text-gray-300 hover:text-white rounded-xl font-bold transition-all cursor-pointer"
                                >
                                    50%
                                </button>
                                <button
                                    onClick={() => setUnstakeAmount((stakedAmount * 0.75).toString())}
                                    className="flex-1 py-3 bg-gray-700/30 hover:bg-gray-600/50 text-gray-300 hover:text-white rounded-xl font-bold transition-all cursor-pointer"
                                >
                                    75%
                                </button>
                                <button
                                    onClick={() => setUnstakeAmount(stakedAmount.toString())}
                                    className="flex-1 py-3 bg-gray-700/30 hover:bg-gray-600/50 text-gray-300 hover:text-white rounded-xl font-bold transition-all cursor-pointer"
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
                                    parseFloat(unstakeAmount) > stakedAmount
                                }
                                className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 px-6 rounded-2xl font-bold text-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                                Unstake {unstakeAmount || '0'} SOL
                            </motion.button>

                            <div className="bg-orange-900/20 border border-orange-700/30 rounded-2xl p-6 mb-4">
                                <h4 className="text-orange-400 font-bold mb-3">⚠️ Unstaking Notice</h4>
                                <p className="text-orange-300 mb-2">
                                    • Unstaking will immediately stop earning rewards on the withdrawn amount. 
                                    You can restake anytime to resume earning.
                                </p>
                                <p className="text-orange-300">
                                    • Unstaking requires a wallet approval to process the transaction.
                                    You'll need to pay a small network fee (about 0.000005 SOL).
                                </p>
                                
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    )
}