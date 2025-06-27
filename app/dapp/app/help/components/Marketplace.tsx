"use client";
import { motion } from "framer-motion";
import { Image, Search, ShoppingBag, Wallet } from "lucide-react";

interface GuideStep {
    title: string;
    description: string;
    icon: React.ComponentType<any>;
    tips?: string[];
}

export default function Marketplace() {

    const marketplaceGuide: GuideStep[] = [
        {
            title: 'Browse Available NFTs',
            description: 'Explore NFTs listed for sale by other users. Use filters to find specific categories or rarities.',
            icon: Search,
            tips: ['Use search and filters effectively', 'Sort by price or popularity', 'Check past sale history']
        },
        {
            title: 'View NFT Details',
            description: 'Click on any NFT to see detailed information, price history, and past buyers.',
            icon: Image,
            tips: ['Review seller reputation', 'Check price trends', 'Verify authenticity']
        },
        {
            title: 'Purchase with SOL',
            description: 'Buy NFTs directly with SOL. The purchase modal shows all details including price predictions.',
            icon: ShoppingBag,
            tips: ['Ensure sufficient SOL balance', 'Consider gas fees', 'Double-check before buying']
        },
        {
            title: 'List Your NFTs',
            description: 'Go to "My NFTs" to list your owned NFTs for sale and set your desired price.',
            icon: Wallet,
            tips: ['Research market prices', 'Set competitive prices', 'Update listings as needed']
        },
    ];
    return (
        <motion.div
            key="marketplace"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
        >
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-8 rounded-3xl border border-gray-700/50 backdrop-blur-sm">
                <h2 className="text-3xl font-bold text-white mb-6">Marketplace Guide</h2>
                <p className="text-gray-300 text-lg mb-8">
                    Learn how to buy and sell NFTs in our decentralized marketplace.
                </p>

                <div className="space-y-6">
                    {marketplaceGuide.map((step, index) => {
                    const Icon = step.icon;
                    return (
                        <div key={index} className="bg-gray-700/30 rounded-2xl p-6 border border-gray-600/50">
                        <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                            <Icon className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                            <h4 className="text-xl font-bold text-white mb-2">
                                Step {index + 1}: {step.title}
                            </h4>
                            <p className="text-gray-300 mb-4">{step.description}</p>
                            {step.tips && (
                                <div className="bg-green-900/20 border border-green-700/30 rounded-xl p-4">
                                <h5 className="text-green-400 font-bold mb-2">💡 Pro Tips:</h5>
                                <ul className="text-green-300 text-sm space-y-1">
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

                <div className="bg-orange-900/20 border border-orange-700/30 rounded-2xl p-6 mt-8">
                    <h4 className="text-orange-400 font-bold mb-3">💰 Trading Fees</h4>
                    <div className="grid md:grid-cols-2 gap-6 text-gray-300">
                    <div>
                        <div className="space-y-2">
                        <div className="flex justify-between">
                            <span>Platform Fee:</span>
                            <span className="text-white font-bold">2.5%</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Creator Royalty:</span>
                            <span className="text-white font-bold">5%</span>
                        </div>
                        <div className="flex justify-between border-t border-gray-600 pt-2">
                            <span>You Receive:</span>
                            <span className="text-green-400 font-bold">92.5%</span>
                        </div>
                        </div>
                    </div>
                    <div className="text-sm">
                        <p className="text-gray-400">
                        Listing is completely free. Fees are only charged when your NFT sells successfully.
                        </p>
                    </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}