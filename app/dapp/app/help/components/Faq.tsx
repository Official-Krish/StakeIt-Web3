"use client";
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, ChevronDown, Search } from 'lucide-react';
import { useState } from 'react';


interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export default function FAQ() {
    const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const faqs: FAQItem[] = [
        {
            question: 'How do I start earning points?',
            answer: 'To start earning points, you need to stake SOL tokens. Go to the Staking page, enter the amount you want to stake, and click "Stake SOL". You\'ll immediately start earning 0.1 points per SOL per second.',
            category: 'staking'
        },
        {
            question: 'What can I do with points?',
            answer: 'Points are used to mint exclusive NFTs from our collection. Each NFT has a different point cost based on its rarity. You can also claim points to reset your counter.',
            category: 'points'
        },
        {
            question: 'How do NFT rarities work?',
            answer: 'NFTs come in four rarity levels: Common (gray), Rare (blue), Epic (purple), and Legendary (gold). Higher rarity NFTs cost more points but are more exclusive and valuable.',
            category: 'nfts'
        },
        {
            question: 'Can I unstake my SOL anytime?',
            answer: 'Yes! There\'s no lock-up period. You can unstake any amount of your staked SOL at any time. However, unstaking will stop earning points on that amount.',
            category: 'staking'
        },
        {
            question: 'How does the marketplace work?',
            answer: 'The marketplace allows you to buy and sell NFTs with other users using SOL. You can browse listings, view price history, and make purchases. To sell, go to "My NFTs" and list your items.',
            category: 'marketplace'
        },
        {
            question: 'What are the trading fees?',
            answer: 'Platform fee is 2.5% and creator royalty is 5% of the sale price. You receive 92.5% of the sale price. Listing is free - fees are only charged on successful sales.',
            category: 'marketplace'
        },
        {
            question: 'How accurate are the staking time predictions?',
            answer: 'Time predictions are calculated in real-time based on your current points, the NFT price, and your staking rate. They update automatically as you stake more SOL.',
            category: 'predictions'
        },
        {
            question: 'Is my wallet secure?',
            answer: 'Yes! We use industry-standard security practices. We never store your private keys - all transactions are signed directly by your wallet. Always verify transactions before signing.',
            category: 'security'
        },
    ];
  
    const filteredFAQs = faqs.filter(faq => 
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <motion.div
            key="faq"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
        >
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-8 rounded-3xl border border-gray-700/50 backdrop-blur-sm">
                <h2 className="text-3xl font-bold text-white mb-6">Frequently Asked Questions</h2>
                
                {/* Search */}
                <div className="relative mb-8">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search FAQs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-2xl pl-12 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div className="space-y-4">
                    {filteredFAQs.map((faq, index) => (
                        <div key={index} className="bg-gray-700/30 rounded-2xl border border-gray-600/50 overflow-hidden">
                            <button
                                onClick={() => setExpandedFAQ(expandedFAQ === faq.question ? null : faq.question)}
                                className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-600/30 transition-colors cursor-pointer"
                            >
                                <div className="flex-1">
                                    <h4 className="text-white font-semibold text-lg">{faq.question}</h4>
                                    <span className="text-sm text-gray-400 capitalize mt-1 inline-block">
                                        {faq.category}
                                    </span>
                                </div>
                                <motion.div
                                    animate={{ rotate: expandedFAQ === faq.question ? 180 : 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <ChevronDown className="w-5 h-5 text-gray-400" />
                                </motion.div>
                            </button>
                            
                            <AnimatePresence>
                            {expandedFAQ === faq.question && (
                                <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                                >
                                <div className="px-6 pb-6 text-gray-300 leading-relaxed">
                                    {faq.answer}
                                </div>
                                </motion.div>
                            )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>

                {filteredFAQs.length === 0 && (
                    <div className="text-center py-12">
                        <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <h4 className="text-xl font-bold text-gray-400 mb-2">No FAQs Found</h4>
                        <p className="text-gray-500">Try adjusting your search terms</p>
                    </div>
                )}
            </div>
        </motion.div>
    )
}