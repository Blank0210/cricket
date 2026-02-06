import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import transactionRoutes from "./routes/transactions.route.js";
import express from "express";
import scoresRoute from "./routes/scores.route.js";
// import { ENV } from "./lib/env.js";
// import { connectDB } from "./lib/db.js";
import cors from "cors";
dotenv.config();
import cookieParser from "cookie-parser";

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(cookieParser());

// Health check endpoint
app.get("/api/health", (req, res) => {
    res.json({ success: true, message: "Server is running", env: NODE_ENV });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api", scoresRoute);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error("Error:", err);
    res.status(err.status || 500).json({
        success: false,
        error: err.message || "Internal server error"
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: "Route not found"
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} in ${NODE_ENV} mode!`);
    // connectDB();
})