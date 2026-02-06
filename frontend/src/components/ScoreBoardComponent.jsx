import { useState } from "react";

function ScoreBoardComponent({
    team1,
    team2,
    score1,
    score2,
    overs1,
    overs2,
    status,
    runsNeeded,
    oversLeft,
    lastUpdated,
}) {

    return (
        <div className="max-w-md mx-auto rounded-2xl border border-slate-950 bg-slate-700 p-5 shadow-sm mt-5">
            {/* Teams Row */}
            <div className="flex items-center justify-between">
                <div className="text-center flex-1">
                    <p className="text-sm text-white">{team1}</p>
                    <p className="text-xl text-white font-semibold">{score1}</p>
                    {overs1 && <p className="text-xs text-slate-400">({overs1} ov)</p>}
                </div>

                <div className="text-sm font-medium text-white px-2">VS</div>

                <div className="text-center flex-1">
                    <p className="text-sm text-white">{team2}</p>
                    <p className="text-xl text-white font-semibold">{score2}</p>
                    {overs2 && <p className="text-xs text-slate-400">({overs2} ov)</p>}
                </div>
            </div>

            {(runsNeeded || oversLeft || status) && (
                <div className="mt-4 flex flex-col gap-1 text-sm text-slate-300 bg-slate-800 p-2 rounded-lg text-center">
                    {status && <p className="text-yellow-400 font-medium">{status}</p>}
                    {runsNeeded && <p>Need: <span className="text-yellow-400 font-bold">{runsNeeded}</span></p>}
                    {oversLeft && <p>Overs: <span className="text-white font-bold">{oversLeft}</span></p>}
                </div>
            )}
            
            {/* Footer */}
            <p className="mt-2 text-xs text-white text-center opacity-70">
                Unofficial • Updated at {lastUpdated}
            </p>
        </div>
    );
}

export default ScoreBoardComponent;
