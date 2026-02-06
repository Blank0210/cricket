import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

function BetCalculatorComponent({ selectedMatch }) {
  const { user, refreshUser } = useAuth();

  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [betAmount, setBetAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [disabledQuestions, setDisabledQuestions] = useState([]);
  const [isSlipOpen, setIsSlipOpen] = useState(false);
  const [odds, setOdds] = useState({
    team1Win: 1.7,
    team2Win: 1.7,
    tossTeam1: 2.0,
    tossTeam2: 2.0,
  })

  const getFavoredTeam = () => {
    // For now, we simulate: team1 is leading
    // Later you can replace this with real live-score logic
    return "team1"; // or "team2"
  };

  // Generate dismissal questions
  const generateDismissalQuestions = () => {
    const team1 = selectedMatch?.team1 || "Team 1";
    const questions = [];

    for (let i = 1; i <= 10; i++) {
      questions.push({
        id: `dismissal_team1_1st_${i}`,
        question: `Will ${team1} have a dismissal in over ${i} - 1st Innings?`,
        options: [
          { text: "Yes", multiplier: 1.4 },
          { text: "No", multiplier: 1.05 },
        ],
      });
    }
    return questions;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setOdds((prev) => {
        const favored = getFavoredTeam(); // "team1" or "team2"

        let newOdds = {
          ...prev,
          team1Win: parseFloat(prev.team1Win),
          team2Win: parseFloat(prev.team2Win),
          tossTeam1: parseFloat(prev.tossTeam1),
          tossTeam2: parseFloat(prev.tossTeam2),
        };

        if (favored === "team1") {
          // Team 1 is winning → lower its odds, raise team 2
          newOdds.team1Win = Math.max(1.1, newOdds.team1Win - 0.05);
          newOdds.team2Win = newOdds.team2Win + 0.05;
        } else {
          // Team 2 is winning → lower its odds, raise team 1
          newOdds.team2Win = Math.max(1.1, newOdds.team2Win - 0.05);
          newOdds.team1Win = newOdds.team1Win + 0.05;
        }

        // Optional: drift toss odds slowly too
        newOdds.tossTeam1 = Math.max(1.5, newOdds.tossTeam1 - 0.01);
        newOdds.tossTeam2 = newOdds.tossTeam2 + 0.01;

        return {
          team1Win: Number(newOdds.team1Win.toFixed(2)),
          team2Win: Number(newOdds.team2Win.toFixed(2)),
          tossTeam1: Number(newOdds.tossTeam1.toFixed(2)),
          tossTeam2: Number(newOdds.tossTeam2.toFixed(2)),
        };
      });
    }, 5000); // every 5 seconds

    return () => clearInterval(interval);
  }, [getFavoredTeam]);

  const fixedPredictions = [
    {
      id: 1,
      question: "Which team will win the toss?",
      options: [
        { text: selectedMatch?.team1 || "Team 1", multiplier: odds.tossTeam1 },
        { text: selectedMatch?.team2 || "Team 2", multiplier: odds.tossTeam2 },
      ],
    },
    {
      id: 2,
      question: "Which team will win the match?",
      options: [
        { text: selectedMatch?.team1 || "Team 1", multiplier: odds.team1Win },
        { text: selectedMatch?.team2 || "Team 2", multiplier: odds.team2Win },
      ],
    },
  ];


  const generalPredictions = [
    {
      id: 3,
      question: "Will the match go into super over?",
      options: [
        { text: "Yes", multiplier: 2.0 },
        { text: "No", multiplier: 1.1 },
      ],
    },
    {
      id: 4,
      question: "Will runs exceed 150 in first inning?",
      options: [
        { text: "Yes", multiplier: 1.5 },
        { text: "No", multiplier: 1.6 },
      ],
    },
  ];

  const dismissalPredictions = generateDismissalQuestions();

  const allQuestions = [
    ...fixedPredictions,
    ...generalPredictions,
    ...dismissalPredictions,
  ];

  const currentQuestion = allQuestions.find((q) => q.id === selectedQuestion);
  const selectedOptionData = currentQuestion?.options.find(
    (opt) => opt.text === selectedOption
  );

  const handleSelectOption = (questionId, optionText) => {
    setSelectedQuestion(questionId);
    setSelectedOption(optionText);
    setBetAmount("");
    setIsSlipOpen(true);
  };

  const calculateReturns = () => {
    const amt = parseFloat(betAmount) || 0;
    const mult = selectedOptionData?.multiplier || 0;
    return (amt * mult).toFixed(2);
  };

  const handleQuickAdd = (delta) => {
    const current = parseFloat(betAmount) || 0;
    setBetAmount(String(Math.max(0, current + delta)));
  };

  const handleBetMax = () => {
    setBetAmount(String(user?.amount || 0));
  };

  const handlePlaceBet = async () => {
    if (!betAmount || parseFloat(betAmount) < 100) {
      alert("Minimum bet is ₹100");
      return;
    }

    if (parseFloat(betAmount) > (user?.amount || 0)) {
      alert("Insufficient balance");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/transactions/bet-result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          amount: parseFloat(betAmount),
          won: true,
          betType: `${currentQuestion.question} - ${selectedOption}`,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Bet failed");

      setDisabledQuestions([...disabledQuestions, selectedQuestion]);
      await refreshUser();

      alert("Bet placed successfully!");
      setIsSlipOpen(false);
      setSelectedQuestion(null);
      setSelectedOption(null);
      setBetAmount("");
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderQuestionBlock = (q, color = "slate") => {
    const isDisabled = disabledQuestions.includes(q.id);

    const baseBg =
      color === "purple"
        ? "bg-purple-900 border-purple-700"
        : "bg-slate-700 border-slate-600";

    const disabledBg =
      color === "purple"
        ? "bg-purple-950 border-purple-900"
        : "bg-slate-900 border-slate-700";

    return (
      <div
        key={q.id}
        className={`p-4 rounded-lg border ${isDisabled ? `${disabledBg} opacity-50` : baseBg
          }`}
      >
        <p className="text-white font-semibold mb-2">{q.question}</p>
        <div className="flex gap-2">
          {q.options.map((opt, i) => (
            <button
              key={i}
              disabled={isDisabled}
              onClick={() => handleSelectOption(q.id, opt.text)}
              className="flex-1 bg-slate-800 hover:bg-slate-600 p-2 rounded text-center text-white transition active:scale-95 disabled:cursor-not-allowed"
            >
              <p className="font-medium">{opt.text}</p>
              <p className="text-sm text-slate-300">{opt.multiplier}x</p>
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-slate-800 border border-slate-700 w-full h-screen p-4 overflow-y-auto rounded-2xl">
      <h2 className="text-white text-2xl font-bold mb-4">Match Predictions</h2>

      {/* Balance */}
      <div className="bg-slate-900 rounded-2xl p-4 mb-4">
        <p className="text-slate-400 text-sm">Current Balance</p>
        <p className="text-yellow-400 text-3xl font-bold">₹ {user?.amount || 0}</p>
      </div>

      {/* Fixed Predictions */}
      <div className="mb-6">
        <p className="text-slate-300 text-xs font-semibold mb-2 uppercase">
          Fixed Predictions
        </p>
        <div className="space-y-3">
          {fixedPredictions.map((q) => renderQuestionBlock(q))}
        </div>
      </div>

      {/* General Predictions */}
      <div className="mb-6">
        <p className="text-slate-300 text-xs font-semibold mb-2 uppercase">
          General Predictions
        </p>
        <div className="space-y-3">
          {generalPredictions.map((q) => renderQuestionBlock(q))}
        </div>
      </div>

      {/* Dismissal Predictions */}
      <div className="mb-20">
        <p className="text-purple-300 text-xs font-semibold mb-2 uppercase">
          Over-by-Over Dismissals
        </p>
        <div className="space-y-3">
          {dismissalPredictions.map((q) => renderQuestionBlock(q, "purple"))}
        </div>
      </div>

      {/* Sliding Bet Slip */}
      {isSlipOpen && currentQuestion && selectedOption && (
        <div className="fixed inset-0 z-9999 flex items-end">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsSlipOpen(false)}
          />

          <div className="relative w-full max-h-[80vh] bg-slate-900 border-t border-slate-700 rounded-t-2xl p-4 overflow-y-auto flex flex-col">
            <div className="max-w-3xl mx-auto w-full flex flex-col">
              <p className="text-white font-semibold mb-1">
                {currentQuestion.question}
              </p>
              <p className="text-blue-400 font-bold mb-3">{selectedOption}</p>

              <input
                type="number"
                min="100"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 text-white rounded-lg mb-3"
                placeholder="Enter bet amount"
              />

              <div className="flex gap-2 mb-3 flex-wrap">
                <button onClick={handleBetMax} className="px-3 py-2 bg-red-700 text-white rounded">Bet Max</button>
                <button onClick={() => handleQuickAdd(25)} className="px-3 py-2 bg-slate-700 text-white rounded">+25</button>
                <button onClick={() => handleQuickAdd(100)} className="px-3 py-2 bg-slate-700 text-white rounded">+100</button>
                <button onClick={() => handleQuickAdd(500)} className="px-3 py-2 bg-slate-700 text-white rounded">+500</button>
              </div>

              <div className="bg-slate-800 rounded-lg p-3 mb-4">
                <p className="text-slate-400 text-xs">Estimated Returns</p>
                <p className="text-green-400 text-2xl font-bold">
                  ₹ {calculateReturns()}
                </p>
                <p className="text-slate-400 text-xs">
                  Multiplier: {selectedOptionData?.multiplier}x
                </p>
              </div>

              <button
                onClick={handlePlaceBet}
                disabled={!betAmount || parseFloat(betAmount) < 100 || loading}
                className="w-full py-4 rounded-xl bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white font-bold text-lg mt-auto"
              >
                {loading ? "Placing Bet..." : "Place Bet"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BetCalculatorComponent;