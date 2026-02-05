import express from "express";
import protectRoute from "../middleware/auth.middleware.js";

const router = express.Router();

const OPENSHEET_URL = "https://opensheet.elk.sh/1JgzKxAA9b-1oB0MovvvfCEtra1xu_aKigTiHuyd_wAI/Sheet1";

let cache = null;
let cacheTime = 0;
const CACHE_TTL = 5000; // 5 seconds

router.get("/scores", protectRoute, async (req, res) => {
  const now = Date.now();

  if (cache && now - cacheTime < CACHE_TTL) {
    return res.json(cache);
  }

  try {
    // 2️⃣ Fetch fresh data from OpenSheet
    const response = await fetch(OPENSHEET_URL);

    if (!response.ok) {
      throw new Error(`OpenSheet error: ${response.status}`);
    }

    const data = await response.json();

    // 3️⃣ Update cache
    cache = {
      matches: data,
      updatedAt: new Date().toISOString()
    };
    cacheTime = now;

    res.json(cache);
  } catch (err) {
    console.error("Failed to fetch scores:", err.message);

    // 4️⃣ If we have old cache, serve it instead of failing
    if (cache) {
      return res.json({
        ...cache,
        warning: "Serving cached data due to fetch error"
      });
    }

    res.status(500).json({ error: "Failed to fetch scores" });
  }
});

export default router;
