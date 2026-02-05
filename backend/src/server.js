// import dotenv from "dotenv";
// import authRoutes from "./routes/auth.route.js";
import express from "express";
import scoresRoute from "./routes/scores.route.js";
// import { ENV } from "./lib/env.js";
// import { connectDB } from "./lib/db.js";
import cors from "cors";
// dotenv.config();

// const PORT = ENV.PORT || 5173;

const app = express();

app.use(express.json());
app.use(cors());

// app.use("/api/auth", authRoutes);
app.use("/api", scoresRoute);

app.listen(3000, () => {
    console.log(`Server is running on 3000!`);
    // connectDB();
})