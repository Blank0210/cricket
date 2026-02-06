import NavbarComponent from "../components/NavbarComponent";
import NavigationComponent from "../components/NavigationComponent";
import UpcomingMatches from "../components/UpcomingMatches";

function HomePage() {
    return (
        <div>
            <NavbarComponent />
            <UpcomingMatches />
            <NavigationComponent />
        </div>
    )
}

export default HomePage;