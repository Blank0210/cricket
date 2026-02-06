import express from "express";
import {
    depositAmount,
    requestWithdrawal,
    getTransactionHistory,
    getUserTransactions,
    recordBetResult
} from "../controllers/transaction.controller.js";
import protectRoute, { authorizeRole } from "../middleware/auth.middleware.js";

const router = express.Router();

// Protected routes - User can access their own
router.get("/history", protectRoute, getTransactionHistory);
router.post("/withdraw", protectRoute, requestWithdrawal);
router.post("/bet-result", protectRoute, recordBetResult);

// Admin/Organizer routes
router.post("/deposit", protectRoute, authorizeRole("admin", "organizer"), depositAmount);
router.get("/user/:userId", protectRoute, authorizeRole("admin", "organizer"), getUserTransactions);

export default router;
