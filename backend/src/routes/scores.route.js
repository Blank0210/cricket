import express from "express";
import fetch from "node-fetch";
// import your auth middleware if you have one
// import authMiddleware from "../middleware/auth.js";

const router = express.Router();

const OPENSHEET_URL = "https://opensheet.elk.sh/YOUR_SHEET_ID/IPL_SCORES";

let cache = null;
let cacheTime = 0;
const CACHE_TTL = 10000; // 10 seconds

router.get("/scores", /* authMiddleware, */ async (req, res) => {
  const now = Date.now();

  if (cache && now - cacheTime < CACHE_TTL) {
    return res.json(cache);
  }

  try {
    const response = await fetch(OPENSHEET_URL);
    const data = await response.json();

    cache = {
      matches: data,
      updatedAt: new Date()
    };
    cacheTime = now;

    res.json(cache);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch scores" });
  }
});

export default router;
