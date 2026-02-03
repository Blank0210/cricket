import { useState } from "react";

function ScoreBoardComponent({
    team1,
    team2,
    score1,
    score2,
    lastUpdated,
}) {

    return (
        <div className="max-w-md mx-auto rounded-2xl border border-slate-950 bg-slate-700 p-5 shadow-sm mt-5">
            {/* Teams Row */}
            <div className="flex items-center justify-between">
                <div className="text-center flex-1">
                    <p className="text-sm text-white">{team1}</p>
                    <p className="text-xl text-white font-semibold">{score1}</p>
                </div>

                <div className="text-sm font-medium text-white px-2">VS</div>

                <div className="text-center flex-1">
                    <p className="text-sm text-white">{team2}</p>
                    <p className="text-xl text-white font-semibold">{score2}</p>
                </div>
            </div>
            
            {/* Footer */}
            <p className="mt-2 text-xs text-white text-center opacity-70">
                Unofficial • Updated at {lastUpdated}
            </p>
        </div>
    );
}

export default ScoreBoardComponent;
