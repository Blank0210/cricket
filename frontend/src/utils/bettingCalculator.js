/**
 * Betting Calculator for Cricket Virtual Bets
 * Designed for high profits and minimal losses
 */

// Bet types with their odds multipliers
export const BET_TYPES = {
  MATCH_WIN: {
    name: "Match Win",
    odds: 1.9, // Win 1.9x your bet
    maxLoss: 0.5, // Lose only 50% of bet on loss
    description: "Bet on team to win the match"
  },
  OVER_UNDER: {
    name: "Over/Under Runs",
    odds: 1.8,
    maxLoss: 0.6,
    description: "Bet on if runs will be over/under a threshold"
  },
  PLAYER_PERFORMANCE: {
    name: "Player Performance",
    odds: 2.5,
    maxLoss: 0.3,
    description: "Bet on player to score X runs or take X wickets"
  },
  FIRST_WICKET: {
    name: "First Wicket",
    odds: 2.2,
    maxLoss: 0.4,
    description: "Bet on which player will be out first"
  },
  HIGHEST_SCORER: {
    name: "Highest Scorer",
    odds: 3.0,
    maxLoss: 0.25,
    description: "Bet on highest scoring player"
  },
  CENTURY_HIT: {
    name: "Century Hit",
    odds: 4.0,
    maxLoss: 0.15,
    description: "Bet on player scoring 100+ runs"
  }
};

/**
 * Calculate bet result with dynamic odds
 * @param {number} betAmount - Amount user is betting
 * @param {string} betType - Type of bet (from BET_TYPES)
 * @param {boolean} betWon - Whether the bet was won
 * @param {number} userBalance - User's current balance
 * @returns {object} { profit/loss, newBalance, odds, details }
 */
export const calculateBetResult = (betAmount, betType, betWon, userBalance) => {
  const bet = BET_TYPES[betType];
  
  if (!bet) {
    return {
      error: "Invalid bet type",
      profit: 0,
      newBalance: userBalance
    };
  }

  let result;

  if (betWon) {
    // Win: User gets bet amount + (bet amount * odds - house fee)
    const houseFee = betAmount * 0.05; // 5% house fee
    const winnings = betAmount * bet.odds - houseFee;
    result = {
      status: "WIN",
      betAmount,
      winnings: Math.round(winnings),
      profit: Math.round(winnings),
      loss: 0,
      newBalance: userBalance + Math.round(winnings),
      odds: bet.odds,
      multiplier: `${bet.odds}x`
    };
  } else {
    // Loss: User loses only maxLoss percentage of bet
    const loss = Math.round(betAmount * bet.maxLoss);
    result = {
      status: "LOSS",
      betAmount,
      loss,
      profit: 0,
      winnings: 0,
      newBalance: userBalance - loss,
      odds: bet.odds,
      maxLossPercentage: `${(bet.maxLoss * 100).toFixed(0)}%`
    };
  }

  return {
    ...result,
    betType: bet.name,
    description: bet.description
  };
};

/**
 * Simulate multiple bets and calculate cumulative P&L
 * @param {array} bets - Array of { amount, type, won }
 * @param {number} startingBalance - Starting balance
 * @returns {object} Summary of all bets
 */
export const calculateMultipleBets = (bets, startingBalance) => {
  let totalBalance = startingBalance;
  let totalProfit = 0;
  let totalLoss = 0;
  let wins = 0;
  let losses = 0;

  const betResults = bets.map(bet => {
    const result = calculateBetResult(
      bet.amount,
      bet.type,
      bet.won,
      totalBalance
    );

    if (result.status === "WIN") {
      totalProfit += result.profit;
      wins++;
    } else {
      totalLoss += result.loss;
      losses++;
    }

    totalBalance = result.newBalance;
    return result;
  });

  const winRate = bets.length > 0 ? ((wins / bets.length) * 100).toFixed(1) : 0;

  return {
    betResults,
    startingBalance,
    finalBalance: totalBalance,
    totalProfit,
    totalLoss,
    netProfit: totalProfit - totalLoss,
    wins,
    losses,
    winRate,
    roi: startingBalance > 0 
      ? (((totalBalance - startingBalance) / startingBalance) * 100).toFixed(1)
      : 0
  };
};

/**
 * Get recommended bet amount based on balance
 * Kelly Criterion: Bet only 5-10% of balance per bet
 * @param {number} balance - Current user balance
 * @returns {number} Recommended bet amount
 */
export const getRecommendedBetAmount = (balance) => {
  const recommendedPercentage = 0.05; // 5% of balance
  return Math.round(balance * recommendedPercentage);
};

/**
 * Get all available bet types
 * @returns {array} Array of bet type objects
 */
export const getAllBetTypes = () => {
  return Object.keys(BET_TYPES).map(key => ({
    id: key,
    ...BET_TYPES[key]
  }));
};
