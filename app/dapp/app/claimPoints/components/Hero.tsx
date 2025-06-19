"use client"
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { motion } from "framer-motion";
import { Coins } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getPdaAccountData } from "../../../hooks/getPdaAccountData";

export default function Hero() {
    const wallet  = useAnchorWallet();
    const [points, setPoints] = useState<number>(0);
    useEffect (() => {
        if (!wallet?.publicKey) return;
        getData();
    }, [wallet?.publicKey]);

    async function getData() {
        try {
            const data = await getPdaAccountData(wallet!);
            setPoints((data.totalPoints)); 
        } catch (error) {
            console.error("Data fetch error:", error);
        }
    }
    
    return (
        <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 to-pink-900/20" />
                <div className="absolute inset-0 opacity-10">
                <Image
                    src="https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg?auto=compress&cs=tinysrgb&w=1600"
                    alt="Background"
                    className="w-full h-full object-cover"
                    width={1920}
                    height={1080}
                />
            </div>
            
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-6xl font-black text-white mb-6">
                        NFT <span className="text-pink-400">Gallery</span>
                    </h1>
                    <p className="text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
                        Transform your earned points into exclusive digital masterpieces
                    </p>
                    
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="inline-flex items-center space-x-3 bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-2xl px-8 py-4"
                    >
                        <Coins className="w-6 h-6 text-green-400" />
                        <span className="text-2xl font-black text-white">
                            {Math.floor(points).toLocaleString()} Points Available
                        </span>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    )
}