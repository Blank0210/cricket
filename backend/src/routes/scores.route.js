import express from "express";
import protectRoute, { authorizeRole } from "../middleware/auth.middleware.js";

const router = express.Router();

const OPENSHEET_URL = "https://opensheet.elk.sh/1JgzKxAA9b-1oB0MovvvfCEtra1xu_aKigTiHuyd_wAI/Sheet1";

let cache = null;
let cacheTime = 0;
const CACHE_TTL = 5000; // 1 second

router.get("/scores", async (req, res) => {
  const now = Date.now();

  if (cache && now - cacheTime < CACHE_TTL) {
    return res.json({
      success: true,
      data: cache,
    });
  }

  try {
    const response = await fetch(OPENSHEET_URL);

    if (!response.ok) {
      throw new Error(`OpenSheet error: ${response.status}`);
    }

    const data = await response.json();

    cache = {
      matches: data,
      updatedAt: new Date().toISOString()
    };
    cacheTime = now;

    res.json({
      success: true,
      data: cache,
    });
  } catch (err) {
    console.error("Failed to fetch scores:", err.message);

    if (cache) {
      return res.json({
        success: true,
        data: cache,
        warning: "Serving cached data due to fetch error",
      });
    }

    res.status(500).json({ success: false, error: "Failed to fetch scores" });
  }
});

// Admin only - manage scores
router.post("/scores/manage", protectRoute, authorizeRole("admin", "organizer"), async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Scores management endpoint. Only accessible to organizers and admins.",
      userRole: req.user.role
    });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to manage scores" });
  }
});

export default router;
