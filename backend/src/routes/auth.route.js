import express from "express";
import { login, logout, signup, getMe, setupAdmin, updateProfile } from "../controllers/auth.controller.js";
import protectRoute, { authorizeRole } from "../middleware/auth.middleware.js";

const router = express.Router();

// Bootstrap endpoint - creates first admin if no users exist
router.post("/setup-admin", setupAdmin);

// Protected endpoints
router.post("/signup", protectRoute, authorizeRole("admin"), signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", protectRoute, getMe);
router.put("/update-profile", protectRoute, updateProfile);

export default router;