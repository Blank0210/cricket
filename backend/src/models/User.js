import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// 💸 Transaction schema (embedded in User)
const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["DEPOSIT", "WITHDRAWAL", "BET_WIN", "BET_LOSS", "ADMIN_ADJUSTMENT"],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  balanceBefore: {
    type: Number,
    required: true,
  },
  balanceAfter: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  reference: {
    type: String, // e.g. receipt number, bet id, etc.
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// 👤 User schema
const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // 🔒 never return password by default
    },

    amount: {
      type: Number,
      default: 1000, // 🎁 starting balance
      min: 0,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    mustChangePassword: {
      type: Boolean,
      default: true, // ✅ good if you manually create users
    },

    transactions: {
      type: [transactionSchema],
      default: [],
    },
  },
  {
    timestamps: true, // adds createdAt, updatedAt
  }
);

// 🔐 Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 🔑 Method to compare password during login
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// 💰 Helper method to add a transaction and update balance safely
userSchema.methods.addTransaction = async function ({
  type,
  amount,
  description = "",
  reference = "",
}) {
  const balanceBefore = this.amount;
  let balanceAfter = balanceBefore;

  if (type === "DEPOSIT" || type === "BET_WIN" || type === "ADMIN_ADJUSTMENT") {
    balanceAfter = balanceBefore + amount;
  } else if (type === "WITHDRAWAL" || type === "BET_LOSS") {
    balanceAfter = balanceBefore - amount;
    if (balanceAfter < 0) {
      throw new Error("Insufficient balance");
    }
  }

  this.transactions.push({
    type,
    amount,
    balanceBefore,
    balanceAfter,
    description,
    reference,
  });

  this.amount = balanceAfter;
  await this.save();

  return this;
};

const User = mongoose.model("User", userSchema);

export default User;