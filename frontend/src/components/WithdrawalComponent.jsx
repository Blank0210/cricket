import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function WithdrawalComponent() {
  const { user } = useAuth();
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleWithdraw = async () => {
    setError("");
    
    if (!withdrawAmount || withdrawAmount <= 0) {
      setError("Enter a valid amount");
      return;
    }

    if (withdrawAmount > (user?.amount || 0)) {
      setError("Insufficient balance");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/transactions/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ amount: parseFloat(withdrawAmount) })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Withdrawal failed");
      }

      setReceipt(data.receipt);
      setWithdrawAmount("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-2xl">
      <h2 className="text-white text-2xl font-bold mb-6">Withdrawal</h2>

      {!receipt ? (
        <div>
          {/* Current Balance */}
          <div className="bg-slate-900 rounded-lg p-4 mb-6">
            <p className="text-slate-400 text-sm">Current Balance</p>
            <p className="text-yellow-400 text-3xl font-bold">₹ {user?.amount || 0}</p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {/* Withdrawal Amount */}
          <div className="mb-6">
            <label className="block text-slate-300 text-sm font-medium mb-2">Withdrawal Amount</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="Enter amount to withdraw"
                className="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 text-white placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-slate-400 py-3 font-semibold">₹</span>
            </div>
          </div>

          {/* Quick Amount Buttons */}
          <div className="mb-6">
            <p className="text-slate-400 text-sm mb-2">Quick select:</p>
            <div className="flex gap-2 flex-wrap">
              {[100, 500, 1000, 5000].map(amt => (
                <button
                  key={amt}
                  onClick={() => setWithdrawAmount(amt)}
                  disabled={amt > (user?.amount || 0)}
                  className="px-3 py-1 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm"
                >
                  ₹{amt}
                </button>
              ))}
            </div>
          </div>

          {/* Withdraw Button */}
          <button
            onClick={handleWithdraw}
            disabled={loading}
            className="w-full px-6 py-3 bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white font-bold rounded-lg transition"
          >
            {loading ? "Processing..." : "Withdraw"}
          </button>
        </div>
      ) : (
        <div>
          {/* Receipt */}
          <div className="bg-white text-black rounded-lg p-8 mb-6 shadow-lg">
            <div className="text-center mb-6 border-b pb-4">
              <h3 className="text-2xl font-bold">WITHDRAWAL RECEIPT</h3>
              <p className="text-gray-600">Cricket Betting Platform</p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Receipt Number:</span>
                <span className="font-bold">{receipt.receiptNumber}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Name:</span>
                <span className="font-semibold">{receipt.userName}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Username:</span>
                <span className="font-semibold">@{receipt.userUsername}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Withdrawal Amount:</span>
                <span className="text-green-600 font-bold text-lg">₹ {receipt.amount}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">New Balance:</span>
                <span className="font-semibold">₹ {receipt.newBalance}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Date:</span>
                <span className="font-semibold">{receipt.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Time:</span>
                <span className="font-semibold">{receipt.time}</span>
              </div>
            </div>

            <div className="text-center text-sm text-gray-500 border-t pt-4">
              <p>This is an automated receipt. Please save for your records.</p>
              <p className="text-xs mt-2">Transaction ID: {receipt.receiptNumber}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handlePrint}
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition"
            >
              🖨️ Print Receipt
            </button>
            <button
              onClick={() => {
                setReceipt(null);
                setError("");
              }}
              className="flex-1 px-6 py-3 bg-slate-600 hover:bg-slate-500 text-white font-bold rounded-lg transition"
            >
              New Withdrawal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default WithdrawalComponent;
