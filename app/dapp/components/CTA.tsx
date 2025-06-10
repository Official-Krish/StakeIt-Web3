"use client"
import { useWallet } from "@solana/wallet-adapter-react";
import { motion } from "framer-motion"
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export function CTA () {
    const router = useRouter();
    const { connected } = useWallet();
    return (
        <div>
            <section className="relative py-32 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 to-cyan-900/30" />
                    <div className="absolute inset-0 opacity-10">
                        <Image
                            src="https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=1600"
                            alt="Background"
                            height={800}
                            width={1600}
                        />
                    </div>
                    
                    <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-4xl font-black text-white mb-8">
                                Ready to <span className="text-cyan-400">Dominate</span> DeFi?
                            </h2>
                            <p className="text-xl text-gray-300 mb-12 leading-relaxed">
                                Join the elite community of stakers earning premium rewards
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-6 justify-center">
                                <motion.button
                                    whileHover={{ 
                                        scale: 1.05,
                                        boxShadow: '0 30px 60px rgba(59, 130, 246, 0.4)',
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-10 py-3 rounded-xl font-bold text-xl shadow-2xl cursor-pointer"
                                    onClick={() => {
                                        if(!connected){
                                            toast.error("Please connect your wallet first.", {
                                                position: "top-right",
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
                                >
                                    Start Earning Now
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="border-2 border-white/30 text-white px-10 py-3 rounded-xl font-bold text-xl hover:bg-white/10 transition-colors backdrop-blur-sm cursor-pointer"
                                    onClick={() => {
                                        if(!connected){
                                            toast.error("Please connect your wallet first.", {
                                                position: "top-right",
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
                                            router.push('/nft');
                                        }
                                    }}
                                >
                                    Explore NFTs
                                </motion.button>
                            </div>
                    </motion.div>
                </div>
            </section>
        </div>
    )
}