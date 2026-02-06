import { useEffect, useState } from "react";
import ScoreBoard from "./ScoreBoardComponent";
import { useNavigate } from "react-router-dom";

function ScoreCardComponent() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:3000/api").replace(/\/$/, "");
        console.log("Fetching from:", `${BASE_URL}/scores`);

        const res = await fetch(`${BASE_URL}/scores`, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const data = await res.json();
        console.log("API RESPONSE:", data);

        // Backend returns: { success: true, data: { matches: [...] } }
        if (data?.data?.matches && Array.isArray(data.data.matches)) {
          setMatches(data.data.matches);
          setError("");
        } else {
          throw new Error("Invalid scores response format");
        }
      } catch (err) {
        console.error("Failed to load scores", err);
        setError(err.message || "Failed to connect to server");
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
    const interval = setInterval(fetchScores, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleMatchClick = (match) => {
    navigate("/mybets", {
      state: { selectedMatch: match },
    });
  };

  if (loading) {
    return <p className="text-center text-white mt-10">Loading scores…</p>;
  }

  if (error) {
    return <p className="text-center text-red-400 mt-10">{error}</p>;
  }

  if (matches.length === 0) {
    return <p className="text-center text-white mt-10">No matches available</p>;
  }

  return (
    <div className="max-w-md mx-auto ml-5 mr-5">
      {matches.map((match) => (
        <div
          key={match.matchId || match.match_id || match._id || Math.random()}
          onClick={() => handleMatchClick(match)}
          className="cursor-pointer hover:opacity-80 transition-opacity"
        >
          <ScoreBoard
            team1={match.team1}
            team2={match.team2}
            score1={match.score1}
            score2={match.score2}
            overs1={match.overs1}
            overs2={match.overs2}
            status={match.status}
            runsNeeded={match.runsNeeded || match.runs_needed}
            oversLeft={match.oversLeft || match.overs_left}
            lastUpdated={match.lastUpdated || match.last_updated || match.last_update}
          />
        </div>
      ))}
    </div>
  );
}

export default ScoreCardComponent;