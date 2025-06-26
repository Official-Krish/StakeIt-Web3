interface StakingPrediction {
    timeNeeded: string;
    dailyPoints: number;
    daysToMint: number;
    currentProgress: number;
}
  
export const calculateStakingPrediction = (
    userPoints: number,
    nftCost: number,
    stakedAmount: number,
): StakingPrediction => {

    const pointsNeeded = Math.max(0, nftCost - userPoints);
    
    const basePointsPerSolPerDay = 864;
    const dailyPoints = stakedAmount * basePointsPerSolPerDay;
    
    const daysToMint = dailyPoints > 0 ? Math.ceil(pointsNeeded / dailyPoints) : Infinity;
    
    const currentProgress = nftCost > 0 ? (userPoints / nftCost) * 100 : 0;
    
    // Format time needed
    let timeNeeded = "";
    if (pointsNeeded <= 0) {
        timeNeeded = "Ready to mint!";
    } else if (daysToMint === Infinity || dailyPoints <= 0) {
        timeNeeded = "Start staking to earn points";
    } else if (daysToMint < 1) {
        const hoursNeeded = Math.ceil((pointsNeeded / dailyPoints) * 24);
            timeNeeded = `~${hoursNeeded} hours`;
        } else if (daysToMint < 30) {
        timeNeeded = `~${daysToMint} days`;
    } else {
    const monthsNeeded = Math.ceil(daysToMint / 30);
        timeNeeded = `~${monthsNeeded} months`;
    }
        
    return {
        timeNeeded,
        dailyPoints: dailyPoints,
        daysToMint,
        currentProgress: Math.min(100, currentProgress)
    };
};