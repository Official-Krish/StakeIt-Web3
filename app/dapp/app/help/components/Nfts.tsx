"use client";
import { motion } from 'framer-motion';
import { Award, Clock, Coins, Image } from 'lucide-react';

interface GuideStep {
    title: string;
    description: string;
    icon: React.ComponentType<any>;
    tips?: string[];
}

export default function NFT() {

    const nftGuide: GuideStep[] = [
        {
            title: 'Earn Points Through Staking',
            description: 'Stake SOL tokens to earn points continuously. Points are the primary currency for minting NFTs.',
            icon: Coins,
            tips: ['Higher stake = faster earning', 'Points never expire', 'Track your earning rate in real-time']
        },
        {
            title: 'Browse NFT Collections',
            description: 'Explore our exclusive NFT marketplace with various categories.',
            icon: Image,
            tips: ['Filter by rarity and category', 'Check affordability indicators', 'Preview before minting']
        },
        {
            title: 'Check Staking Predictions',
            description: 'Each NFT shows if you can afford it now or how long you need to stake to earn enough points.',
            icon: Clock,
            tips: ['Green means affordable now', 'Blue shows time needed', 'Orange means start staking']
        },
        {
            title: 'Mint Your NFT',
            description: 'Once you have enough points, click "Mint NFT" to add it to your collection permanently.',
            icon: Award,
            tips: ['Minting is instant', 'NFTs are stored on-chain', 'You can trade them later']
        },
    ];

    return (
        <motion.div
            key="nfts"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
        >
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-8 rounded-3xl border border-gray-700/50 backdrop-blur-sm">
                <h2 className="text-3xl font-bold text-white mb-6">NFT Guide</h2>
                <p className="text-gray-300 text-lg mb-8">
                    Discover how to mint and collect exclusive NFTs using your earned points.
                </p>

                <div className="space-y-6">
                    {nftGuide.map((step, index) => {
                        const Icon = step.icon;
                        return (
                            <div key={index} className="bg-gray-700/30 rounded-2xl p-6 border border-gray-600/50">
                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-gradient-to-r from-pink-600 to-violet-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-xl font-bold text-white mb-2">
                                            Step {index + 1}: {step.title}
                                        </h4>
                                        <p className="text-gray-300 mb-4">{step.description}</p>
                                        {step.tips && (
                                            <div className="bg-pink-900/20 border border-pink-700/30 rounded-xl p-4">
                                                <h5 className="text-pink-400 font-bold mb-2">💡 Pro Tips:</h5>
                                                <ul className="text-pink-300 text-sm space-y-1">
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

                <div className="grid md:grid-cols-2 gap-6 mt-8">
                    <div className="bg-gray-700/30 rounded-2xl p-6 border border-gray-600/50">
                        <h4 className="text-white font-bold mb-4">Popular Categories</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-300">
                            <span>• Genesis</span>
                            <span>• Animals</span>
                            <span>• Abstract</span>
                            <span>• Futuristic</span>
                            <span>• Nature</span>
                            <span>• Space</span>
                            <span>• Mythical</span>
                            <span>• And more...</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}