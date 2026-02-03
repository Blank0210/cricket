
import { useEffect, useState } from "react";

 function MatchAmountComponent() {

    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock data
        const data = [
            { id: 1, team1: "RR", team2: "KKR", amountbet: 1000, finalAmount: 1200 },
            { id: 2, team1: "CSK", team2: "MI", amountbet: 1000, finalAmount: 1200 },
            { id: 3, team1: "RCB", team2: "SRH", amountbet: 1000, finalAmount: 1200 },
            { id: 4, team1: "KXIP ", team2: "LSG", amountbet: 1000, finalAmount: 1200 },
            { id: 5, team1: "DC", team2: "KKR", amountbet: 1000, finalAmount: 1200 },
            { id: 6, team1: "GT", team2: "SRH", amountbet: 1000, finalAmount: 1200 },
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