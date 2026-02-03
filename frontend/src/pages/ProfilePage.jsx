import NavbarComponent from "../components/NavbarComponent";
import NavigationComponent from "../components/NavigationComponent";
import ProfileComponent from "../components/ProfileComponent";
import TransactionComponent from "../components/TransactionComponent";

function ProfilePage() {
    return (
        <div className="min-h-screen bg-gray-900">
            <NavbarComponent />
            <ProfileComponent />
            <div className="text-white font-bold text-xl flex-1 text-center mt-5">Previous Transactions</div>
            <TransactionComponent />
            <div className="max-w-md mx-auto fixed bottom-20 ml-13 text-gray-500 font-bold">
                <p>Need help? Contact us johndoe@gmail.com</p>
            </div>
            <NavigationComponent />
        </div>
    );
}

export default ProfilePage;