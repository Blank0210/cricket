import { ENV } from "../lib/env.js";
import { generateToken } from "../lib/utils.js";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

export const signup = async (req, res) => {
    const { username, password, fullName, role } = req.body;

    if (!username || !password || !fullName) {
        return res.status(400).json({ error: "Username, password, and fullName are required!" });
    }

    if (password.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters long" });
    }

    if (username.length < 3) {
        return res.status(400).json({ error: "Username must be at least 3 characters long" });
    }

    try {
        const userExists = await User.findOne({ username: username.toLowerCase() });
        if (userExists) {
            return res.status(409).json({ error: "Username already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Determine user role (organizer or user, only admins can create)
        const userRole = role === "organizer" ? "organizer" : "user";

        const newUser = new User({
            username: username.toLowerCase(),
            fullName,
            password: hashedPassword,
            role: userRole
        });

        await newUser.save();
        generateToken(newUser._id, res);

        res.status(201).json({
            success: true,
            user: {
                _id: newUser._id,
                fullName: newUser.fullName,
                username: newUser.username,
                role: newUser.role,
                amount: newUser.amount
            }
        });
    } catch (error) {
        console.error("Error in signup controller:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required!" });
    }

    try {
        const user = await User.findOne({ username: username.toLowerCase() });

        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        if (!user.isActive) {
            return res.status(403).json({ error: "Account is inactive" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        generateToken(user._id, res);

        res.status(200).json({
            success: true,
            user: {
                _id: user._id,
                fullName: user.fullName,
                username: user.username,
                role: user.role,
                amount: user.amount,
                profilePicture: user.profilePicture
            }
        });
    } catch (error) {
        console.error("Error in login controller:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const logout = async (req, res) => {
    res.cookie("jwt", "", { maxAge: 0, httpOnly: true });
    res.status(200).json({ success: true, message: "Logged out successfully" });
};

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.error("Error in getMe controller:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const setupAdmin = async (req, res) => {
    const { username, password, fullName } = req.body;

    if (!username || !password || !fullName) {
        return res.status(400).json({ error: "Username, password, and fullName are required!" });
    }

    if (password.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters long" });
    }

    if (username.length < 3) {
        return res.status(400).json({ error: "Username must be at least 3 characters long" });
    }

    try {
        // Check if any users exist in the database
        const userCount = await User.countDocuments();
        
        if (userCount > 0) {
            return res.status(403).json({ error: "Admin already exists. Use /signup endpoint with admin privileges." });
        }

        const userExists = await User.findOne({ username: username.toLowerCase() });
        if (userExists) {
            return res.status(409).json({ error: "Username already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = new User({
            username: username.toLowerCase(),
            fullName,
            password: hashedPassword,
            role: "admin"
        });

        await newAdmin.save();
        generateToken(newAdmin._id, res);

        res.status(201).json({
            success: true,
            message: "Admin user created successfully",
            user: {
                _id: newAdmin._id,
                fullName: newAdmin.fullName,
                username: newAdmin.username,
                role: newAdmin.role,
                amount: newAdmin.amount
            }
        });
    } catch (error) {
        console.error("Error in setupAdmin controller:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const updateProfile = async (req, res) => {
    const { fullName } = req.body;

    if (!fullName || fullName.trim() === "") {
        return res.status(400).json({ error: "Full name is required!" });
    }

    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        user.fullName = fullName.trim();
        await user.save();

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: {
                _id: user._id,
                fullName: user.fullName,
                username: user.username,
                role: user.role,
                amount: user.amount
            }
        });
    } catch (error) {
        console.error("Error in updateProfile controller:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};