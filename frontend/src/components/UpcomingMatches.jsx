import { useEffect, useState } from "react";

function UpcomingMatches() {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 🔹 Mock data (acts like API response)
        const data = [
            { id: 1, team1: "Rajasthan Royals", team2: "Kolkata Knight Riders" },
            { id: 2, team1: "Chennai Super Kings", team2: "Mumbai Indians" },
            { id: 3, team1: "Royal Challengers Bangalore", team2: "Sunrisers Hyderabad" },
            { id: 4, team1: "Kings XII Punjab", team2: "Lucknow Super Gaints" },
            { id: 5, team1: "Delhi Capitals", team2: "Kolkata Knight Riders" },
            { id: 6, team1: "Gujarat Titans", team2: "Sun Risers Hyderabad" },
        ];

        // Simulate API delay
        const timer = setTimeout(() => {
            try {
                setMatches(data);
                setLoading(false);
            } catch (error) {
                console.error("Error loading matches:", error);
                setLoading(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return (<p className="text-white text-center mt-5">Loading upcoming matches...</p>);
    }

    return (
        <>
            {matches.map((match) => (
                <div key={match.id} className="max-w-md mx-auto rounded-2xl border border-slate-950 bg-slate-700 p-5 shadow-sm mt-5 ml-5 mr-5">

                    {/* Team Names */}
                    <div className="flex items-center justify-between">
                        <div className="text-center flex-1">
                            <p className="text-sm text-white">{match.team1}</p>
                        </div>

                        <div className="text-sm font-medium text-white px-2">VS</div>

                        <div className="text-center flex-1">
                            <p className="text-sm text-white">{match.team2}</p>
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
}

export default UpcomingMatches;
