import NavbarComponent from "../components/NavbarComponent";
import NavigationComponent from "../components/NavigationComponent";
import ScoreCardComponent from "../components/ScorecardComponent";
import UpcomingMatches from "../components/UpcomingMatches";

function HomePage() {
    return (
        <div>
            <NavbarComponent />
            <div className="text-green-500 font-bold text-xl flex-1 text-center mt-5">Ongoing Match</div>
            <ScoreCardComponent />
            <div className="text-white font-bold text-xl flex-1 text-center mt-5">Upcoming Matches</div>
            <UpcomingMatches />
            <NavigationComponent />
        </div>
    )
}

export default HomePage;