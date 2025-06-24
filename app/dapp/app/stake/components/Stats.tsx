"use client"
import { getPdaAccountData } from "@/hooks/Staking";
import { UpdatePoints } from "@/hooks/Staking";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { motion } from "framer-motion"
import { Activity, Gift, RefreshCw, Target } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Stats() {
    const wallet  = useAnchorWallet();
    const [stakedAmount, setStakedAmount] = useState<number>(0);
    const [points, setPoints] = useState<number>(0);
    const router = useRouter();
    const [isUpdatingPoints, setIsUpdatingPoints] = useState<boolean>(false);

    useEffect (() => {
        if (!wallet?.publicKey) return;
        getData();
    }, [wallet?.publicKey]);

    async function getData() {
        try {
            const data = await getPdaAccountData(wallet!);
            setPoints(Number(data.totalPoints)); 
            setStakedAmount(Number(data.stakedAmount) / 1e9);
        } catch (error) {
            console.error("Data fetch error:", error);
        }
    }

    const handleUpdatePoints = async () => {
        if (!wallet?.publicKey) return;
        try {
            setIsUpdatingPoints(true);
            await UpdatePoints(wallet!);
            const data = await getPdaAccountData(wallet!);
            setPoints(Number(data.totalPoints));
            setStakedAmount(Number(data.stakedAmount) / 1e9);
        } catch (error) {   
            console.error("Error updating points:", error);
        }
        setIsUpdatingPoints(false);
    };

    const pointsPerSecond = stakedAmount * 0.01;
    const dailyEarnings = Math.floor(pointsPerSecond * 86400);
    return (
        <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-6"
        >
            {/* Real-time Activity */}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-8 rounded-3xl border border-gray-700/50 backdrop-blur-sm">
                <div className="flex items-center space-x-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-400 rounded-2xl flex items-center justify-center">
                        <Activity className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">Live Activity</h3>
                        <p className="text-gray-400 text-sm">Real-time earnings</p>
                    </div>
                </div>
        
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-300">Points/Second</span>
                        <span className="text-green-400 font-bold">
                            +{pointsPerSecond.toFixed(2)}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-300">Points/Hour</span>
                        <span className="text-green-400 font-bold">
                            +{(pointsPerSecond * 3600).toFixed(0)}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-300">Points/Day</span>
                        <span className="text-green-400 font-bold">
                            +{(dailyEarnings)}
                        </span>
                    </div>
                </div>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => router.push("/nft")}
                    disabled={points <= 0}
                    className="w-full mt-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-2xl font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg cursor-pointer"
                >
                    <Gift className="w-5 h-5" />
                    <span>Claim {(points)} Points</span>
                </motion.button>

                <div className="mt-3">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleUpdatePoints}
                        disabled={isUpdatingPoints}
                        className="w-full bg-gradient-to-r from-blue-600/80 to-cyan-600/80 hover:from-blue-600 hover:to-cyan-600 text-white py-3 px-6 rounded-2xl font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-lg"
                    >
                    <motion.div
                        animate={isUpdatingPoints ? { rotate: 360 } : { rotate: 0 }}
                        transition={isUpdatingPoints ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}
                    >
                        <RefreshCw className="w-5 h-5" />
                    </motion.div>
                    <span>{isUpdatingPoints ? 'Updating...' : 'Update Points'}</span>
                    </motion.button>
                </div>
            </div>

            {/* Staking Goals */}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-8 rounded-3xl border border-gray-700/50 backdrop-blur-sm">
                <div className="flex items-center space-x-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center">
                    <   Target className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">Staking Goals</h3>
                        <p className="text-gray-400 text-sm">Track your progress</p>
                    </div>
                </div>

                <div className="space-y-6">
                    {[
                    { label: 'Beginner', target: 10, reward: '1,000 pts' },
                    { label: 'Intermediate', target: 50, reward: '10,000 pts' },
                    { label: 'Expert', target: 100, reward: '25,000 pts' },
                    ].map((goal) => {
                        const progress = Math.min((stakedAmount / goal.target) * 100, 100);
                        return (
                            <div key={goal.label} className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-300">{goal.label}</span>
                                <span className="text-blue-400">{goal.reward}</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                                <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2 rounded-full"
                                />
                            </div>
                            <div className="text-xs text-gray-400">
                                {stakedAmount} / {goal.target} SOL
                            </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </motion.div>
    )
}