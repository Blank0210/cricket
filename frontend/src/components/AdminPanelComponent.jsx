import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function AdminPanelComponent() {
  const { user } = useAuth();
  const [userId, setUserId] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState("");

  if (user?.role !== "admin" && user?.role !== "organizer") {
    return (
      <div className="bg-red-900 border border-red-700 rounded-2xl p-6 text-center">
        <p className="text-red-400 font-semibold">⛔ Access Denied</p>
        <p className="text-red-300 text-sm mt-2">Only admins and organizers can access this panel</p>
      </div>
    );
  }

  const handleDeposit = async () => {
    setError("");
    setSuccess(null);

    if (!userId || !amount || amount <= 0) {
      setError("Please fill all fields with valid values");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/transactions/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          userId,
          amount: parseFloat(amount),
          description: description || `Deposit by ${user.role}`
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Deposit failed");
      }

      setSuccess({
        userName: data.user.fullName,
        userUsername: data.user.username,
        newBalance: data.user.amount,
        amount: amount
      });

      setUserId("");
      setAmount("");
      setDescription("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-md">
      <h2 className="text-white text-2xl font-bold mb-2">💼 Admin Panel</h2>
      <p className="text-slate-400 text-sm mb-6">Manage user account balances</p>

      {/* Success Message */}
      {success && (
        <div className="bg-green-900 border border-green-700 rounded-lg p-4 mb-6">
          <p className="text-green-400 font-semibold">✓ Deposit Successful</p>
          <p className="text-green-300 text-sm mt-2">{success.userName}</p>
          <p className="text-green-300 text-sm">@{success.userUsername}</p>
          <p className="text-green-400 font-bold mt-2">New Balance: ₹ {success.newBalance}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-900 border border-red-700 rounded-lg p-4 mb-6">
          <p className="text-red-400 font-semibold">✗ Error</p>
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      {/* User ID Input */}
      <div className="mb-4">
        <label className="block text-slate-300 text-sm font-medium mb-2">User ID (MongoDB ID)</label>
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="Paste user MongoDB ID"
          className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-white placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
        <p className="text-slate-500 text-xs mt-1">Found in user profile or database</p>
      </div>

      {/* Amount Input */}
      <div className="mb-4">
        <label className="block text-slate-300 text-sm font-medium mb-2">Amount to Deposit</label>
        <div className="flex gap-2">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 text-white placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-slate-400 py-2 font-semibold">₹</span>
        </div>
      </div>

      {/* Description */}
      <div className="mb-6">
        <label className="block text-slate-300 text-sm font-medium mb-2">Description (Optional)</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Reason for deposit (e.g., Win compensation, sign-up bonus)"
          className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-white placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-20 text-sm"
        />
      </div>

      {/* Quick Amount Buttons */}
      <div className="mb-6">
        <p className="text-slate-400 text-sm mb-2">Quick deposit amounts:</p>
        <div className="flex gap-2 flex-wrap">
          {[100, 500, 1000, 5000, 10000].map(amt => (
            <button
              key={amt}
              onClick={() => setAmount(amt.toString())}
              className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition"
            >
              ₹{amt}
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleDeposit}
          disabled={loading || !userId || !amount}
          className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg transition"
        >
          {loading ? "Processing..." : "💰 Deposit Amount"}
        </button>
      </div>

      {/* Info Box */}
      <div className="mt-6 bg-blue-900 border border-blue-700 rounded-lg p-4">
        <p className="text-blue-300 text-xs font-semibold">📋 INFO</p>
        <p className="text-blue-300 text-xs mt-2">
          • This action adds funds to user's account
        </p>
        <p className="text-blue-300 text-xs">
          • A transaction record will be created automatically
        </p>
        <p className="text-blue-300 text-xs">
          • User can view in their transaction history
        </p>
      </div>
    </div>
  );
}

export default AdminPanelComponent;
