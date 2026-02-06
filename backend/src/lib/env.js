import 'dotenv/config';

export const ENV = {
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET || "your-secret-key-change-in-production",
    NODE_ENV: process.env.NODE_ENV || "development"
} 