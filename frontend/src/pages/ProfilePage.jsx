import NavbarComponent from "../components/NavbarComponent";
import NavigationComponent from "../components/NavigationComponent";
import ProfileComponent from "../components/ProfileComponent";
import WithdrawalComponent from "../components/WithdrawalComponent";
import TransactionHistoryComponent from "../components/TransactionHistoryComponent";
import AdminPanelComponent from "../components/AdminPanelComponent";
import { useAuth } from "../context/AuthContext";

function ProfilePage() {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-gray-900 pb-20">
            <NavbarComponent />
            
            <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
                <ProfileComponent />
                
                {/* Admin Panel - Only for admins/organizers */}
                {(user?.role === "admin" || user?.role === "organizer") && (
                    <div>
                        <h2 className="text-white font-bold text-xl text-center mb-4">Admin Controls</h2>
                        <AdminPanelComponent />
                    </div>
                )}

                {/* Withdrawal Section */}
                <div>
                    <h2 className="text-white font-bold text-xl text-center mb-4">Manage Balance</h2>
                    <WithdrawalComponent />
                </div>

                {/* Transaction History */}
                <div>
                    <h2 className="text-white font-bold text-xl text-center mb-4">Transaction History</h2>
                    <TransactionHistoryComponent />
                </div>

                <div className="text-gray-500 font-bold text-center mt-8">
                    <p>Need help? Contact us johndoe@gmail.com</p>
                </div>
            </div>
            
            <NavigationComponent />
        </div>
    );
}

export default ProfilePage;