import { useAuth } from "../context/AuthContext";
import { useState } from "react";

function ProfileComponent() {
    const { user, updateProfile, loading } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(user?.fullName || "");

    if (!user) {
        return (
            <div className="max-w-4xl mx-auto p-4">
                <div className="bg-slate-800 rounded-lg p-6 text-white">
                    <p>Loading profile...</p>
                </div>
            </div>
        );
    }

    const handleEditToggle = () => {
        setEditedName(user.fullName);
        setIsEditing(!isEditing);
    };

    const handleSaveName = async () => {
        if (!editedName.trim()) {
            alert("Name cannot be empty");
            return;
        }

        try {
            await updateProfile(editedName);
            setIsEditing(false);
        } catch (error) {
            alert("Failed to update name: " + error.message);
        }
    };

    const initials = user.fullName
        .split(" ")
        .map(name => name.charAt(0))
        .join("")
        .toUpperCase();

    return (
        <div>
            <main className="max-w-4xl mx-auto p-4">
                <section className="bg-slate-800 border border-slate-700 rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        {/* User Info */}
                        <div className="flex items-center gap-4">
                            <div className="w-20 h-20 rounded-full bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center text-2xl font-bold shadow-lg">
                                {initials}
                            </div>

                            <div className="flex-1">
                                {isEditing ? (
                                    <div className="flex gap-2 mb-2">
                                        <input
                                            type="text"
                                            value={editedName}
                                            onChange={(e) => setEditedName(e.target.value)}
                                            className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Enter your name"
                                        />
                                        <button
                                            onClick={handleSaveName}
                                            disabled={loading}
                                            className="px-4 py-2 bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white rounded-lg font-semibold transition"
                                        >
                                            {loading ? "Saving..." : "Save"}
                                        </button>
                                        <button
                                            onClick={handleEditToggle}
                                            className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg font-semibold transition"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3 mb-2">
                                        <h2 className="text-2xl font-semibold">{user.fullName}</h2>
                                        <button
                                            onClick={handleEditToggle}
                                            className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white rounded-lg text-sm transition"
                                            title="Edit name"
                                        >
                                            ✏️ Edit
                                        </button>
                                    </div>
                                )}
                                <p className="text-slate-400 text-sm">@{user.username}</p>
                                <p className="text-blue-400 text-xs font-semibold mt-1">
                                    {user.role === "admin" ? "🔐 Admin" : user.role === "organizer" ? "👨‍💼 Organizer" : "👤 Player"}
                                </p>
                            </div>
                        </div>

                        {/* Balance Display */}
                        <div className="bg-linear-to-br from-yellow-400 to-yellow-500 rounded-xl p-6 shadow-lg">
                            <p className="text-yellow-900 text-sm font-semibold">Account Balance</p>
                            <p className="text-3xl font-bold text-yellow-900 mt-2">₹ {user.amount || 0}</p>
                            <p className="text-yellow-700 text-xs mt-2">Updated in real-time</p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}

export default ProfileComponent;