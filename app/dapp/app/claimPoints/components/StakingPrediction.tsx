import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, TrendingUp, Zap } from "lucide-react";
import { calculateStakingPrediction } from "@/utils/stakingPrediction";

interface StakingPredictionProps {
  userPoints: number;
  nftCost: number;
  stakedAmount: number;
}

const StakingPrediction = ({ userPoints, nftCost, stakedAmount }: StakingPredictionProps) => {
    const prediction = calculateStakingPrediction(userPoints, nftCost, stakedAmount);
    
    if (userPoints >= nftCost) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg p-3 border border-green-500/20"
            >
                <div className="flex items-center space-x-2 text-green-400">
                    <Zap className="w-4 h-4" />
                    <span className="text-md font-medium">Ready to mint!</span>
                </div>
            </motion.div>
        );
    }

    return (
        <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-gray-700/50 backdrop-blur-sm">
            <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-blue-400" />
                        <span className="text-md font-medium text-white">Time to Mint</span>
                    </div>
                    <span className="text-md font-bold text-blue-400">{prediction.timeNeeded}</span>
                </div>
                
                <div className="space-y-2">
                    <div className="flex justify-between text-sm text-white/95">
                        <span>Progress</span>
                        <span>{userPoints.toLocaleString()} / {nftCost.toLocaleString()} PTS</span>
                    </div>
                    <div className="w-full bg-gray-700/50 rounded-full h-2">
                        <div 
                            className="bg-white h-2 rounded-full transition-all duration-300 ease-out"
                            style={{ width: `${Math.min(prediction.currentProgress, 100)}%` }}
                        />
                    </div>
                </div>
                
                {stakedAmount > 0 && prediction.dailyPoints > 0 && (
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-1 text-white/95">
                            <TrendingUp className="w-3 h-3" />
                            <span>Daily earning</span>
                        </div>
                        <span className="text-emerald-400 font-medium">{prediction.dailyPoints.toLocaleString()} PTS</span>
                    </div>
                )}
                
                {stakedAmount === 0 && (
                    <div className="text-sm text-orange-400 text-center">
                        💡 Start staking SOL to earn points faster!
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default StakingPrediction;