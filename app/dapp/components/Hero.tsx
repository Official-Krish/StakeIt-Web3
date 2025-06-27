"use client"
import { useWallet } from '@solana/wallet-adapter-react';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Play, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

export function Hero () {
    const router = useRouter();
    const { connected } = useWallet();
    return (
        <div>
            <section className="relative min-h-screen flex items-center justify-center">
                {/* Animated Background */}
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
                    <motion.div
                        animate={{
                            scale: [1, 1.1, 1],
                            rotate: [0, 5, 0],
                        }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="absolute inset-0 opacity-20"
                            style={{
                            backgroundImage: 'url(https://images.pexels.com/photos/844124/pexels-photo-844124.jpeg?auto=compress&cs=tinysrgb&w=1600)',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    />
                
                    {/* Floating Elements */}
                    {[...Array(8)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 100 }}
                            animate={{ 
                                opacity: [0, 0.6, 0],
                                y: [-100, -200, -300],
                                x: [0, Math.sin(i) * 50, 0],
                            }}
                            transition={{
                                duration: 8 + i,
                                repeat: Infinity,
                                delay: i * 2,
                                ease: "easeOut"
                            }}
                            className="absolute w-2 h-2 bg-blue-400 rounded-full"
                            style={{
                                left: `${10 + (i * 12)}%`,
                                bottom: '0%',
                            }}
                        />
                    ))}
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                        className="mb-8"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-full px-6 py-3 mb-8"
                        >
                            <Zap className="w-4 h-4 text-blue-400" />
                            <span className="text-blue-300 font-medium">Next-Gen Staking Protocol</span>
                        </motion.div>
                        
                        <h1 className="text-6xl md:text-8xl font-black text-white mb-6 leading-tight">
                            <span className="block">STAKE</span>
                            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-green-400 bg-clip-text text-transparent">
                                EVOLVE
                            </span>
                            <span className="block">EARN</span>
                        </h1>
                        
                        <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
                            Experience the future of DeFi with our revolutionary staking platform. 
                            Real-time rewards, exclusive NFTs, and yields that adapt to market conditions.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                            <motion.button
                                whileHover={{ 
                                    scale: 1.05,
                                    boxShadow: '0 25px 50px rgba(59, 130, 246, 0.4)',
                                }}
                                onClick={() => {
                                    if(!connected){
                                        toast.error("Please connect your wallet first.", {
                                            position: "bottom-right",
                                            autoClose: 3000,
                                            hideProgressBar: false,
                                            closeOnClick: true,
                                            pauseOnHover: true,
                                            draggable: true,
                                            progress: undefined,
                                            theme: "dark",
                                        });
                                    }
                                    else {
                                        router.push('/stake');
                                    }
                                }}
                                whileTap={{ scale: 0.95 }}
                                className="group bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-9 py-3 rounded-xl font-bold text-xl flex items-center space-x-3 shadow-2xl relative overflow-hidden cursor-pointer"
                            >
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                />
                                <span className="relative z-10">Launch App</span>
                                <ArrowRight className="w-6 h-6 relative z-10 group-hover:translate-x-1 transition-transform" />
                            </motion.button>
                            
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="group flex items-center space-x-3 text-white font-semibold text-xl cursor-pointer"
                                onClick={() => router.push('/help')}
                            >
                                <div className="w-13 h-13 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors">
                                    <Play className="w-6 h-6 ml-1" />
                                </div>
                                <span>Learn How</span>
                            </motion.button>
                        </div>
                    </motion.div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60"
                    >
                    <ChevronDown className="w-8 h-8" />
                </motion.div>
            </section>
        </div>
    )
}