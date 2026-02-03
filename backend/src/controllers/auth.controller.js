import { ENV } from "../lib/env.js";
import { generateToken } from "../lib/utils.js";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

export const login = async (req, res) => {
    const { email, password } = req.body;

    if(!email || !password) {
        return res.status(400).json({ message: "Email and password are required!"});
    }

    try {
        const user = await User.findOne({ email });

        if(!user) return res.status(400).json({ message: "Invalid Credentials"});

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if(!isPasswordCorrect) return res.status(400).json({ message: "Invalid Credentials!"});

        // generate a token
        generateToken(user._id, res)

        res.status(200).json({
            _id : user._id,
            fullName : user.fullName,
            email : user.email,
        });
    } catch (error) {
        console.error("Error in login controller", error);
        res.status(500).json({ message: "Internal server error"});
    }
};

export const logout = async(req, res) => {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully!"});
};