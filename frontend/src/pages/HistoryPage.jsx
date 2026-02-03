import BalanceComponent from "../components/BalanceComponent";
import MatchAmountComponent from "../components/MatchAmountComponent";
import NavbarComponent from "../components/NavbarComponent";
import NavigationComponent from "../components/NavigationComponent";

function HistoryPage() {
    return (
        <div>
            <NavbarComponent />
            <BalanceComponent />
            <NavigationComponent />
            <MatchAmountComponent />
        </div>
    )
}

export default HistoryPage;