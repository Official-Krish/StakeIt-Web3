"use client";
import { motion } from 'framer-motion';
import { Coins, Star, Wallet, Zap } from 'lucide-react';

interface GuideStep {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  tips?: string[];
}

export default function Staking() {
    const stakingGuide: GuideStep[] = [
        {
            title: 'Connect Your Wallet',
            description: 'Start by connecting your Solana wallet to the platform. We support Phantom, Backpack, and other popular wallets.',
            icon: Wallet,
            tips: ['Make sure you have SOL in your wallet', 'Keep your seed phrase secure', 'Use a hardware wallet for large amounts']
        },
        {
            title: 'Navigate to Staking',
            description: 'Go to the Staking page from the main navigation menu to access all staking features.',
            icon: Zap,
            tips: ['Check the current APY rates', 'Review your existing stakes', 'Monitor real-time earnings']
        },
        {
            title: 'Enter Stake Amount',
            description: 'Choose how much SOL you want to stake. You can use quick amount buttons or enter a custom amount.',
            icon: Coins,
            tips: ['Start small if you\'re new', 'Consider staking goals', 'Leave some SOL for transaction fees']
        },
        {
            title: 'Start Earning',
            description: 'Once staked, you\'ll immediately start earning 0.1 points per SOL per second. Watch your points grow in real-time!',
            icon: Star,
            tips: ['Points accumulate automatically', 'No lock-up period', 'Compound your rewards by restaking']
        },
    ];
    return (
        <motion.div
            key="staking"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
        >
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-8 rounded-3xl border border-gray-700/50 backdrop-blur-sm">
                <h2 className="text-3xl font-bold text-white mb-6">Staking Guide</h2>
                <p className="text-gray-300 text-lg mb-8">
                    Learn how to stake SOL and maximize your earnings on SolanaStake.
                </p>

                <div className="space-y-6">
                    {stakingGuide.map((step, index) => {
                        const Icon = step.icon;
                        return (
                            <div key={index} className="bg-gray-700/30 rounded-2xl p-6 border border-gray-600/50">
                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-xl font-bold text-white mb-2">
                                            Step {index + 1}: {step.title}
                                        </h4>
                                        <p className="text-gray-300 mb-4">{step.description}</p>
                                        {step.tips && (
                                            <div className="bg-blue-900/20 border border-blue-700/30 rounded-xl p-4">
                                                <h5 className="text-blue-400 font-bold mb-2">💡 Pro Tips:</h5>
                                                <ul className="text-blue-300 text-sm space-y-1">
                                                    {step.tips.map((tip, tipIndex) => (
                                                        <li key={tipIndex}>• {tip}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="bg-yellow-900/20 border border-yellow-700/30 rounded-2xl p-6 mt-8">
                    <h4 className="text-yellow-400 font-bold mb-3">💰 Earning Formula</h4>
                    <div className="grid md:grid-cols-3 gap-4 text-gray-300">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-white">0.01</div>
                            <div className="text-sm">Points per SOL per second</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-white">864</div>
                            <div className="text-sm">Points per SOL per day</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-white">86,400</div>
                            <div className="text-sm">Points for 10 SOL per day</div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}