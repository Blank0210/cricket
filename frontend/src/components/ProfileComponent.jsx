import { useState } from "react";

function ProfileComponent() {

    const [user] = useState({
        name: "John Doe",
        email: "john.doe@example.com",
        balance: 124.5,
    });

    return (
        <div>
            <main className="max-w-4xl mx-auto p-4">
                <section className="bg-gray-800 rounded-lg p-6 text-white shadow-md">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center text-2xl font-semibold">
                                {user.name.split(" ")[0].charAt(0)}{user.name.split(" ")[1]?.charAt(0)}
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold">{user.name}</h2>
                                <p className="text-sm text-gray-300">{user.email}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="text-right mr-4">
                                <p className="text-sm text-gray-300">Balance</p>
                                <p className="text-2xl font-bold">{user.balance.toFixed(2)}</p>
                            </div>

                            <div className="flex gap-2">
                                <button className="bg-amber-400 text-gray-900 px-4 py-2 rounded-md hover:opacity-95">Deposit</button>
                                <button className="bg-gray-600 text-white px-4 py-2 rounded-md hover:opacity-95">Withdraw</button>
                            </div>
                        </div>
                    </div>
                </section>

            </main>
        </div>
    )
}

export default ProfileComponent;