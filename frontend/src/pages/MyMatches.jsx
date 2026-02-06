import NavbarComponent from "../components/NavbarComponent";
import ScoreCardComponent from "../components/ScorecardComponent";
import NavigationComponent from "../components/NavigationComponent";
import BetCalculatorComponent from "../components/BetCalculatorComponent";
import { Link, useLocation } from "react-router-dom";

function MyMatches() {
    const location = useLocation();
    const selectedMatch = location.state?.selectedMatch;

    return(
        <div className="flex flex-col min-h-screen bg-slate-900">
            <NavbarComponent />
            
            <div className="flex-1 overflow-y-auto">
                {selectedMatch ? (
                    <>
                        <div className="text-white font-bold text-xl flex-1 text-center mt-5">Selected Match</div>
                        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 text-white shadow-lg max-w-md mx-auto ml-5 mr-5 mb-6">
                            <div className="flex justify-between items-center mb-4">
                                <div className="text-center flex-1">
                                    <p className="text-lg font-bold">{selectedMatch.team1}</p>
                                    <p className="text-2xl font-bold text-yellow-400">{selectedMatch.score1}</p>
                                    {selectedMatch.overs1 && <p className="text-sm text-slate-400">({selectedMatch.overs1} ov)</p>}
                                </div>
                                <div className="text-center mx-4">
                                    <p className="text-sm text-slate-400">VS</p>
                                </div>
                                <div className="text-center flex-1">
                                    <p className="text-lg font-bold">{selectedMatch.team2}</p>
                                    <p className="text-2xl font-bold text-yellow-400">{selectedMatch.score2}</p>
                                    {selectedMatch.overs2 && <p className="text-sm text-slate-400">({selectedMatch.overs2} ov)</p>}
                                </div>
                            </div>
                            <div className="text-sm text-slate-400 text-center mt-2">
                                {selectedMatch.status && <p className="text-yellow-400 font-bold mb-1">{selectedMatch.status}</p>}
                                {selectedMatch.runs_needed && <p>Runs Needed: {selectedMatch.runs_needed}</p>}
                                {selectedMatch.overs_left && <p>Overs Left: {selectedMatch.overs_left}</p>}
                            </div>
                            {(selectedMatch.last_update || selectedMatch.lastUpdated) && (
                                <p className="text-xs text-slate-500 text-center mt-4">Updated: {selectedMatch.last_update || selectedMatch.lastUpdated}</p>
                            )}
                        </div>

                        <div className="px-6 py-5">
                            <BetCalculatorComponent selectedMatch={selectedMatch} />
                        </div>

                    </>
                ) : (
                    <>
                        <div className="text-white font-bold text-xl flex-1 text-center mt-5">Ongoing Match</div>
                        <ScoreCardComponent />
                        
                        <div className="px-6 py-5">
                            <BetCalculatorComponent />
                        </div>

                    </>
                )}
            </div>

            <div className="text-white text-center mt-5 px-6 py-5">
                <Link to="/profile">
                    <p className="text-xl pb-5">Want to add more amount?</p>
                    <button className="bg-blue-800 hover:bg-blue-500 text-white font-bold py-4 px-6 rounded-2xl">Go to Profile</button>
                </Link>
            </div>
            <NavigationComponent />
        </div>
    )
}

export default MyMatches;