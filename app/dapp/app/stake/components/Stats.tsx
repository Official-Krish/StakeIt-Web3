"use client"
import { motion } from "framer-motion"
import { Activity, Gift, Target } from "lucide-react";

export default function Stats() {
    const handleClaimPoints = () => {
        console.log("Points Claimed")
    };
    const user = {
        stakedSol: 1,
        availablePoints: 1
    }
    const pointsPerSecond = user.stakedSol * 0.1;
    const dailyEarnings = pointsPerSecond * 86400;
    const apy = user.stakedSol > 0 ? ((dailyEarnings * 365) / user.stakedSol) * 100 : 0;
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
                            +{pointsPerSecond.toFixed(1)}
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
                            +{Math.floor(dailyEarnings).toLocaleString()}
                        </span>
                    </div>
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleClaimPoints}
                    disabled={user.availablePoints <= 0}
                    className="w-full mt-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-6 rounded-2xl font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg"
                >
                    <Gift className="w-5 h-5" />
                    <span>Claim {Math.floor(user.availablePoints).toLocaleString()} Points</span>
                </motion.button>
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
                        const progress = Math.min((user.stakedSol / goal.target) * 100, 100);
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
                                {user.stakedSol.toFixed(1)} / {goal.target} SOL
                            </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </motion.div>
    )
}