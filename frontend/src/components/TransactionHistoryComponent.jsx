import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

function TransactionHistoryComponent() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/transactions/history", {
        method: "GET",
        credentials: "include"
      });

      const data = await res.json();

      if (data.success) {
        setTransactions(data.transactions || []);
      }
    } catch (err) {
      console.error("Error fetching transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  const getTransactionIcon = (type) => {
    const icons = {
      DEPOSIT: "💳",
      WITHDRAWAL: "🏦",
      BET_WIN: "🎉",
      BET_LOSS: "❌",
      ADMIN_ADJUSTMENT: "⚙️"
    };
    return icons[type] || "📝";
  };

  const getTransactionColor = (type) => {
    const colors = {
      DEPOSIT: "text-green-400",
      WITHDRAWAL: "text-yellow-400",
      BET_WIN: "text-green-500",
      BET_LOSS: "text-red-400",
      ADMIN_ADJUSTMENT: "text-blue-400"
    };
    return colors[type] || "text-slate-400";
  };

  const filteredTransactions = filter === "ALL" 
    ? transactions 
    : transactions.filter(t => t.type === filter);

  if (loading) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
        <p className="text-slate-400">Loading transactions...</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-white text-2xl font-bold">Transaction History</h2>
        <button
          onClick={fetchTransactions}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Current Balance */}
      <div className="bg-slate-900 rounded-lg p-4 mb-6">
        <p className="text-slate-400 text-sm">Current Balance</p>
        <p className="text-yellow-400 text-3xl font-bold">₹ {user?.amount || 0}</p>
      </div>

      {/* Filter */}
      <div className="mb-6">
        <div className="flex gap-2 flex-wrap">
          {["ALL", "DEPOSIT", "WITHDRAWAL", "BET_WIN", "BET_LOSS"].map(type => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === type
                  ? "bg-blue-600 text-white"
                  : "bg-slate-700 hover:bg-slate-600 text-slate-300"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredTransactions.length === 0 ? (
          <p className="text-slate-400 text-center py-8">No transactions found</p>
        ) : (
          filteredTransactions.map((transaction, index) => (
            <div
              key={index}
              className="bg-slate-700 border border-slate-600 rounded-lg p-4 hover:border-slate-500 transition"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-3 flex-1">
                  <span className="text-2xl">{getTransactionIcon(transaction.type)}</span>
                  <div>
                    <p className={`font-semibold ${getTransactionColor(transaction.type)}`}>
                      {transaction.type}
                    </p>
                    <p className="text-slate-400 text-sm">{transaction.description}</p>
                    <p className="text-slate-500 text-xs mt-1">
                      {new Date(transaction.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-bold ${
                    transaction.type === "WITHDRAWAL" ? "text-red-400" : "text-green-400"
                  }`}>
                    {transaction.type === "WITHDRAWAL" ? "−" : "+"} ₹ {Math.abs(transaction.amount)}
                  </p>
                  <p className="text-slate-400 text-sm">
                    Balance: ₹ {transaction.balanceAfter}
                  </p>
                </div>
              </div>
              {transaction.reference && (
                <p className="text-slate-500 text-xs mt-2">Ref: {transaction.reference}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default TransactionHistoryComponent;
