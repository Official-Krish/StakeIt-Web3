"use client";
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import GettingStarted from './GettingStarted';
import Staking from './Staking';
import NFT from './Nfts';
import Marketplace from './Marketplace';
import FAQ from './Faq';
import { useState } from 'react';
import { BookOpen, Play, ShoppingBag, Zap } from 'lucide-react';

export default function Hero(){
    const [activeSection, setActiveSection] = useState<'getting-started' | 'staking' | 'nfts' | 'marketplace' | 'faq'>('getting-started');

    const sections = [
        { id: 'getting-started', label: 'Getting Started', icon: Play },
        { id: 'staking', label: 'Staking Guide', icon: Zap },
        { id: 'nfts', label: 'NFT Guide', icon: Image },
        { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
        { id: 'faq', label: 'FAQ', icon: BookOpen },
    ];

    return (
        <div>
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-cyan-900/20" />
                    <div className="absolute inset-0 opacity-5">
                        <Image
                            src="https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=1600"
                            alt="Background"
                            className="w-full h-full object-cover"
                            height={600}
                            width={1600}
                        />
                    </div>
            
                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center mb-12"
                        >
                            <h1 className="text-6xl font-black text-white mb-6">
                                Help <span className="text-cyan-400">Center</span>
                            </h1>
                            <p className="text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
                                Everything you need to know about StakeIT
                            </p>
                        </motion.div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
                    <div className="grid lg:grid-cols-4 gap-8">
                        {/* Sidebar Navigation */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="lg:col-span-1"
                        >
                            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-6 rounded-3xl border border-gray-700/50 backdrop-blur-sm sticky top-24">
                                <h3 className="text-xl font-bold text-white mb-6">Browse Topics</h3>
                                <nav className="space-y-2">
                                    {sections.map((section) => {
                                        return (
                                            <button
                                                key={section.id}
                                                onClick={() => setActiveSection(section.id as any)}
                                                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold transition-all cursor-pointer ${
                                                    activeSection === section.id
                                                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                                                    : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                                                }`}
                                            >
                                                <span>{section.label}</span>
                                            </button>
                                        );
                                    })}
                                </nav>
                            </div>
                        </motion.div>

                    {/* Main Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:col-span-3"
                    >
                        <AnimatePresence mode="wait">
                        {activeSection === 'getting-started' && (
                            <GettingStarted setActiveSection={setActiveSection} />
                        )}

                        {activeSection === 'staking' && (
                            <Staking/>
                        )}

                        {activeSection === 'nfts' && (
                            <NFT/>
                        )}

                        {activeSection === 'marketplace' && (
                            <Marketplace/>
                        )}

                        {activeSection === 'faq' && (
                            <FAQ/>
                        )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}