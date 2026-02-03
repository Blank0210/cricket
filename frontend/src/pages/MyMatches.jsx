import NavbarComponent from "../components/NavbarComponent";
import ScoreCardComponent from "../components/ScorecardComponent";
import NavigationComponent from "../components/NavigationComponent";
import GainLossComponent from "../components/GainLossComponent";
import { Link } from "react-router-dom";

function MyMatches() {
    return(
        <div>
            <NavbarComponent />
            <div className="text-white font-bold text-xl flex-1 text-center mt-5">Ongoing Match</div>
            <ScoreCardComponent />
            <div className="text-white font-bold text-xl flex-1 text-center mt-5">Match gain/loss</div>
            <GainLossComponent />

            <div className="text-white text-center mt-5">
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