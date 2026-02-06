import { useNavigate, useLocation } from "react-router-dom";
import { CircleGauge, HomeIcon, TimerReset, TrophyIcon } from "lucide-react";

function NavigationComponent() {
  const navigate = useNavigate();
  const location = useLocation();

  const active = location.pathname === "/" ? "home" : location.pathname === "/mymatches" ? "matches" : location.pathname === "/rewards" ? "rewards" : "home";

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-500 rounded-t-2xl mx-2.5 z-50">
      <div className="flex justify-around items-center h-14">

        {/* Home */}
        <button onClick={() => navigate("/") } className={`flex flex-col items-center text-xs font-medium 
        ${active === "home" ? "text-blue-950" : "text-slate-100"}`}>
          <span className="text-lg"><HomeIcon /></span>Home
        </button>

        {/* My Matches */}
        <button onClick={() => navigate("/mybets") } className={`flex flex-col items-center text-xs font-medium 
        ${active === "matches" ? "text-blue-950" : "text-slate-100"}`}>
          <span className="text-lg"><CircleGauge /></span>My Bets
        </button>

        {/* History */}
        <button onClick={() => navigate("/rewards") } className={`flex flex-col items-center text-xs font-medium 
        ${active === "rewards" ? "text-blue-950" : "text-slate-100"}`}>
          <span className="text-lg"><TimerReset /></span>History
        </button>

      </div>
    </div>
  );
}

export default NavigationComponent;