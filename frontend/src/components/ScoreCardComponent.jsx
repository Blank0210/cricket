import { useEffect, useState } from "react";
import ScoreBoard from "./ScoreBoardComponent";

function ScoreCardComponent() {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchScores = async () => {
            try {
                const res = await fetch("http://localhost:3000/api/scores");
                const data = await res.json();

                console.log("API RESPONSE:", data);

                setMatches(data.matches ?? []);
            } catch (err) {
                console.error("Failed to load scores", err);
            } finally {
                setLoading(false);
            }
        };

        fetchScores();
        const interval = setInterval(fetchScores, 30000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return <p className="text-center text-white mt-10">Loading scores…</p>;
    }

    if (matches.length === 0) {
        return <p className="text-center text-white mt-10">No matches available</p>;
    }

    return (
        <div className="max-w-md mx-auto ml-5 mr-5">
            {matches.map(match => (
                <ScoreBoard
                    key={match.match_id ?? Math.random()}
                    team1={match.team1}
                    team2={match.team2}
                    score1={match.score1}
                    score2={match.score2}
                    runsNeeded={match.runs_needed}
                    oversLeft={match.overs_left}
                    lastUpdated={match.last_updated}
                />
            ))}
        </div>
    );
}

export default ScoreCardComponent;
