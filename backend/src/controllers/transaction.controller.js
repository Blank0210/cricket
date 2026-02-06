import User from "../models/User.js";

/**
 * Generate unique receipt number
 */
const generateReceiptNumber = () => {
    return "RCP-" + Date.now().toString().slice(-6) + "-" + Math.random().toString(36).substr(2, 5).toUpperCase();
};

/**
 * Add transaction to user
 */
const addTransaction = async (userId, transactionData) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }

        const newTransaction = {
            ...transactionData,
            balanceBefore: user.amount,
            balanceAfter: transactionData.type === "WITHDRAWAL" 
                ? user.amount - transactionData.amount 
                : user.amount + transactionData.amount
        };

        user.transactions.push(newTransaction);

        if (transactionData.type === "WITHDRAWAL") {
            user.amount -= transactionData.amount;
        } else {
            user.amount += transactionData.amount;
        }

        await user.save();
        return newTransaction;
    } catch (error) {
        throw error;
    }
};

/**
 * Admin deposits amount to user
 */
export const depositAmount = async (req, res) => {
    const { userId, amount, description } = req.body;

    if (!userId || !amount || amount <= 0) {
        return res.status(400).json({ error: "User ID and positive amount required" });
    }

    if (req.user.role !== "admin" && req.user.role !== "organizer") {
        return res.status(403).json({ error: "Only admins/organizers can deposit amounts" });
    }

    try {
        const transaction = await addTransaction(userId, {
            type: "DEPOSIT",
            amount: parseFloat(amount),
            description: description || "Amount deposited by " + req.user.role,
            reference: "DEP-" + Date.now()
        });

        const user = await User.findById(userId);

        res.status(200).json({
            success: true,
            message: "Amount deposited successfully",
            user: {
                _id: user._id,
                fullName: user.fullName,
                username: user.username,
                amount: user.amount
            },
            transaction
        });
    } catch (error) {
        console.error("Error in depositAmount:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * User requests withdrawal
 */
export const requestWithdrawal = async (req, res) => {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
        return res.status(400).json({ error: "Positive amount required" });
    }

    try {
        const user = await User.findById(req.user._id);

        if (user.amount < amount) {
            return res.status(400).json({ error: "Insufficient balance" });
        }

        const receiptNumber = generateReceiptNumber();

        const transaction = await addTransaction(req.user._id, {
            type: "WITHDRAWAL",
            amount: parseFloat(amount),
            description: "Withdrawal request",
            reference: receiptNumber
        });

        const updatedUser = await User.findById(req.user._id);

        res.status(200).json({
            success: true,
            message: "Withdrawal successful",
            receipt: {
                receiptNumber,
                amount,
                newBalance: updatedUser.amount,
                timestamp: new Date().toISOString(),
                date: new Date().toLocaleDateString(),
                time: new Date().toLocaleTimeString(),
                userUsername: user.username,
                userName: user.fullName
            },
            user: {
                _id: updatedUser._id,
                amount: updatedUser.amount
            }
        });
    } catch (error) {
        console.error("Error in requestWithdrawal:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Get transaction history
 */
export const getTransactionHistory = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const transactions = user.transactions.sort((a, b) => b.createdAt - a.createdAt);

        res.status(200).json({
            success: true,
            transactions,
            currentBalance: user.amount
        });
    } catch (error) {
        console.error("Error in getTransactionHistory:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Admin views user transactions
 */
export const getUserTransactions = async (req, res) => {
    const { userId } = req.params;

    if (req.user.role !== "admin" && req.user.role !== "organizer") {
        return res.status(403).json({ error: "Forbidden" });
    }

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const transactions = user.transactions.sort((a, b) => b.createdAt - a.createdAt);

        res.status(200).json({
            success: true,
            user: {
                _id: user._id,
                fullName: user.fullName,
                username: user.username,
                amount: user.amount
            },
            transactions
        });
    } catch (error) {
        console.error("Error in getUserTransactions:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Record bet result and update balance
 */
export const recordBetResult = async (req, res) => {
    const { amount, won, betType } = req.body;

    if (!amount || typeof won !== "boolean") {
        return res.status(400).json({ error: "Amount and bet result required" });
    }

    try {
        const user = await User.findById(req.user._id);

        if (won) {
            // Calculate winnings (with 5% house fee)
            const houseFee = amount * 0.05;
            const winnings = Math.round(amount * 1.9 - houseFee);

            const transaction = await addTransaction(req.user._id, {
                type: "BET_WIN",
                amount: winnings,
                description: `Won bet on ${betType}`,
                reference: "BET-" + Date.now()
            });

            const updatedUser = await User.findById(req.user._id);

            res.status(200).json({
                success: true,
                message: "Bet won!",
                winnings,
                newBalance: updatedUser.amount,
                transaction
            });
        } else {
            // Calculate loss (only lose partial amount based on bet type)
            const loss = Math.round(amount * 0.5); // Default 50% loss

            const transaction = await addTransaction(req.user._id, {
                type: "BET_LOSS",
                amount: -loss,
                description: `Lost bet on ${betType}`,
                reference: "BET-" + Date.now()
            });

            const updatedUser = await User.findById(req.user._id);

            res.status(200).json({
                success: true,
                message: "Bet lost",
                loss,
                newBalance: updatedUser.amount,
                transaction
            });
        }
    } catch (error) {
        console.error("Error in recordBetResult:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export default {
    depositAmount,
    requestWithdrawal,
    getTransactionHistory,
    getUserTransactions,
    recordBetResult
};
