// import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import express from "express";
import scoresRoute from "./routes/scores.route.js";
// import { ENV } from "./lib/env.js";
// import { connectDB } from "./lib/db.js";
import cors from "cors";
// dotenv.config();
import cookieParser from "cookie-parser";

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api", scoresRoute);

app.listen(PORT, () => {
    console.log(`Server is running on 3000!`);
    // connectDB();
})