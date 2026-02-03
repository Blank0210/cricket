import express from "express";
import fetch from "node-fetch";

const router = express.Router();

const OPENSHEET_URL ="https://opensheet.elk.sh/1JgzKxAA9b-1oB0MovvvfCEtra1xu_aKigTiHuyd_wAI/Sheet1";

router.get("/", async (req, res) => {
    try {
        const response = await fetch(OPENSHEET_URL);
        const data = await response.json();

        res.json({
            source: "manual",
            updatedAt: new Date(),
            matches: data
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch scores" });
    }
});

export default router;