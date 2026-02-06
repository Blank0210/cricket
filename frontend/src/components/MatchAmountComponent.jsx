
import { useEffect, useState } from "react";

function MatchAmountComponent() {

    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock data
        const data = [
            { id: 1, team1: "PAKISTAN", team2: "NETHERLANDS", date: "7 February", time: "11:00" },
            { id: 2, team1: "WEST INDIES", team2: "SCOTLAND", date: "7 February", time: "15:00" },
            { id: 3, team1: "INDIA", team2: "USA", date: "7 February", time: "19:00" },

            { id: 4, team1: "NEW ZEALAND", team2: "AFGHANISTAN", date: "8 February", time: "11:00" },
            { id: 5, team1: "ENGLAND", team2: "NEPAL", date: "8 February", time: "15:00" },
            { id: 6, team1: "SRI LANKA", team2: "IRELAND", date: "8 February", time: "19:00" },

            { id: 7, team1: "SCOTLAND", team2: "ITALY", date: "9 February", time: "11:00" },
            { id: 8, team1: "ZIMBABWE", team2: "OMAN", date: "9 February", time: "15:00" },
            { id: 9, team1: "SOUTH AFRICA", team2: "CANADA", date: "9 February", time: "19:00" },

            { id: 10, team1: "NETHERLANDS", team2: "NAMBIA", date: "10 February", time: "11:00" },
            { id: 11, team1: "NEW ZEALAND", team2: "UAE", date: "10 February", time: "15:00" },
            { id: 12, team1: "PAKISTAN", team2: "USA", date: "10 February", time: "19:00" },

            { id: 13, team1: "SOUTH AFRICA", team2: "AFGHANISTAN", date: "11 February", time: "11:00" },
            { id: 14, team1: "AUSTRALIA", team2: "IRELAND", date: "11 February", time: "15:00" },
            { id: 15, team1: "ENGLAND", team2: "WEST INDIES", date: "11 February", time: "19:00" },

            { id: 16, team1: "SRI LANKA", team2: "OMAN", date: "12 February", time: "11:00" },
            { id: 17, team1: "NEPAL", team2: "ITALY", date: "12 February", time: "15:00" },
            { id: 18, team1: "INDIA", team2: "NAMBIA", date: "12 February", time: "19:00" },

            { id: 19, team1: "AUSTRALIA", team2: "ZIMBABWE", date: "13 February", time: "11:00" },
            { id: 20, team1: "CANADA", team2: "UAE", date: "13 February", time: "15:00" },
            { id: 21, team1: "USA", team2: "NETHERLANDS", date: "13 February", time: "19:00" },

            { id: 22, team1: "IRELAND", team2: "OMAN", date: "14 February", time: "11:00" },
            { id: 23, team1: "ENGLAND", team2: "SCOTLAND", date: "14 February", time: "15:00" },
            { id: 24, team1: "NEW ZEALAND", team2: "SOUTH AFRICA", date: "14 February", time: "19:00" },

            { id: 25, team1: "WEST INDIES", team2: "NEPAL", date: "15 February", time: "11:00" },
            { id: 26, team1: "USA", team2: "NAMBIA", date: "15 February", time: "15:00" },
            { id: 27, team1: "INDIA", team2: "PAKISTAN", date: "15 February", time: "19:00" },

            { id: 28, team1: "AFGHANISTAN", team2: "UAE", date: "16 February", time: "11:00" },
            { id: 29, team1: "ENGLAND", team2: "ITALY", date: "16 February", time: "15:00" },
            { id: 30, team1: "AUSTRALIA", team2: "SRI LANKA", date: "16 February", time: "19:00" },

            { id: 31, team1: "NEW ZEALAND", team2: "CANADA", date: "17 February", time: "11:00" },
            { id: 32, team1: "IRELAND", team2: "ZIMBABWE", date: "17 February", time: "15:00" },
            { id: 33, team1: "SCOTLAND", team2: "NEPAL", date: "17 February", time: "19:00" },

            { id: 34, team1: "SOUTH AFRICA", team2: "UAE", date: "18 February", time: "11:00" },
            { id: 35, team1: "PAKISTAN", team2: "NAMBIA", date: "18 February", time: "15:00" },
            { id: 36, team1: "INDIA", team2: "NETHERLANDS", date: "18 February", time: "19:00" },

            { id: 37, team1: "WEST INDIES", team2: "ITALY", date: "19 February", time: "11:00" },
            { id: 38, team1: "SRI LANKA", team2: "ZIMBABWE", date: "19 February", time: "15:00" },
            { id: 39, team1: "AFGHANISTAN", team2: "CANADA", date: "19 February", time: "19:00" },
        ];

        setTimeout(() => {
            try {
                setMatches(data);
                setLoading(false);
            } catch (error) {
                console.error("Error loading matches:", error);
                setLoading(false);
            }
        }, 500);
    }, []);

    if (loading) {
        return (<p className="text-white text-center mt-5">Loading match transactions...</p>)
    }
    return (
        <>
            {matches.map((match) => (
                <div key={match.id} className="max-w-md mx-auto rounded-2xl border border-slate-950 bg-slate-700 p-5 shadow-sm mt-5 ml-5 mr-5">

                    <div className="flex items-center justify-between">
                        <div className="text-center flex-1">
                            <p className="text-sm text-white">{match.team1}</p>
                        </div>

                        <div className="text-sm font-medium text-white px-2">VS</div>

                        <div className="text-center flex-1">
                            <p className="text-sm text-white">{match.team2}</p>
                        </div>
                    </div>

                    <div className="mt-3 text-center">
                        <p className="text-xs text-gray-300">Bet Amount: ₹{match.amountbet}</p>
                        <p className="text-xs text-green-400">Final Amount: ₹{match.finalAmount}</p>
                    </div>

                </div>
            ))}
        </>
    )
}

export default MatchAmountComponent;