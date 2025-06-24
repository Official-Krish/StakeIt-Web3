"use client"
import { motion } from "framer-motion";
import { Wallet, Coins, TrendingUp, BarChart3 } from 'lucide-react';
import AnimatedCounter from "./AnimatedCounter";
import Image from "next/image";
import { getPdaAccountData } from "@/hooks/Staking";
import { useEffect, useState } from "react";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { CreatePda } from "@/hooks/Staking";

export function Hero () {
    const wallet = useAnchorWallet();
    const [totalPoints, setTotalPoints] = useState(0);
    const [stakedAmount, setStakedAmount] = useState(0);
    const [initialLoad, setInitialLoad] = useState(true); 
    const [pdaCreated, setPdaCreated] = useState(false);
    const [accruedrReward, setAccruedReward] = useState(0);

    // Only run once on wallet connection
    useEffect(() => {
        if (!wallet?.publicKey || !initialLoad) return;

        const initialize = async () => {
            try {
                await getData();
                const pdaKey = `pda-created-${wallet.publicKey.toBase58()}`;
                const isPdaCreated = localStorage.getItem(pdaKey);

                if (!isPdaCreated) {
                    createPdA();
                }
            } catch (error) {
                console.error("Initialization error:", error);
            } finally {
                setInitialLoad(false);
            }
        };
        initialize();
    }, [wallet?.publicKey]); 

    // Separate useEffect for periodic data refresh
    useEffect(() => {
        if (!wallet?.publicKey) return;

        const interval = setInterval(() => {
            getData();
        }, 1000 * 60 * 5); 

        return () => clearInterval(interval);
    }, [wallet?.publicKey]);

    async function createPdA() {
        if (pdaCreated) return;

        try {
            await CreatePda(wallet!);
            localStorage.setItem(`pda-created-${wallet!.publicKey.toBase58()}`, "true");
            setPdaCreated(true);
        } catch (error) {
            // Handle "account already exists" error gracefully
            if (error instanceof Error && error.message.includes("already in use")) {
                setPdaCreated(true);
                return;
            }
            console.error("PDA creation error:", error);
        }
    }

    async function getData() {
        try {
            const data = await getPdaAccountData(wallet!);
            setTotalPoints(Number(data.totalPoints)); 
            setStakedAmount(Number(data.stakedAmount) / 1e9);
            setAccruedReward(Number(data.accruedReward) / 1e9);
        } catch (error) {
            console.error("Data fetch error:", error);
        }
    }

    
    const user = {
        stakedSol: stakedAmount,
        availablePoints: totalPoints, 
        accruedrReward: accruedrReward
    }
    
    const dailyEarnings = user.stakedSol * 864;
    const apy = "7";
    
    return (
        <div className="mt-6">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-cyan-900/20" />
                <div className="absolute inset-0 opacity-5">
                    <Image
                        src="https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg?auto=compress&cs=tinysrgb&w=1600"
                        alt="Background"
                        className="w-full h-full object-cover"
                        height={600}
                        width={1600}
                    />
                </div>
            
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <h1 className="text-6xl font-black text-white mb-6">
                            Staking <span className="text-cyan-400">Command Center</span>
                        </h1>
                        <p className="text-2xl text-gray-300 max-w-3xl mx-auto">
                            Monitor, manage, and maximize your staking rewards in real-time
                        </p>
                    </motion.div>

                {/* Performance Overview */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="grid md:grid-cols-4 gap-6 mb-16"
                >
                    {[
                    {
                        label: 'Total Staked',
                        value: `${user.stakedSol} SOL`,
                        icon: Wallet,
                        color: 'from-blue-500 to-cyan-400',
                        bgColor: 'from-blue-600/20 to-cyan-600/20',
                    },
                    {
                        label: 'Available Points',
                        value: Math.floor(user.availablePoints).toLocaleString(),
                        icon: Coins,
                        color: 'from-green-500 to-emerald-400',
                        bgColor: 'from-green-600/20 to-emerald-600/20',
                    },
                    {
                        label: 'Accumulated Rewards',
                        value: `${Math.floor(user.accruedrReward).toLocaleString()} SOL`,
                        icon: TrendingUp,
                        color: 'from-orange-500 to-yellow-400',
                        bgColor: 'from-orange-600/20 to-yellow-600/20',
                    },
                    {
                        label: 'Current APY',
                        value: `${apy}%`,
                        icon: BarChart3,
                        color: 'from-violet-500 to-pink-400',
                        bgColor: 'from-violet-600/20 to-pink-600/20',
                    },
                    ].map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * index }}
                            whileHover={{ y: -5, scale: 1.02 }}
                            className={`relative bg-gradient-to-br ${stat.bgColor} p-6 rounded-3xl border border-gray-700/50 backdrop-blur-sm overflow-hidden group`}
                        >
                        <div className="relative z-10">
                            <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center mb-4`}>
                                <Icon className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-3xl font-black text-white mb-2">
                                {stat.label === 'Available Points' ? (
                                    <AnimatedCounter value={Math.floor(user.availablePoints)} />
                                ) : (
                                    stat.value
                                )}
                            </div>
                            <div className="text-gray-400 font-medium">{stat.label}</div>
                        </div>
                        
                        {/* Animated background effect */}
                        <motion.div
                            className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                        />
                        </motion.div>
                    );
                    })}
                </motion.div>
            </div>
        </div>
    )
}