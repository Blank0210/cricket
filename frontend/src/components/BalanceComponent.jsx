import { useEffect, useState } from "react";

function BalanceComponent() {
    return (
        <div className="max-w-4xl mx-auto p-4">
            <section className="bg-gray-800 rounded-lg p-7 text-white shadow-md">

                {/* Row container */}
                <div className="flex justify-between items-center">

                    {/* Invested Amount */}
                    <div>
                        <h2 className="text-sm text-gray-400">Total Invested Amount</h2>
                        <p className="text-xl font-semibold">₹10,000</p>
                    </div>

                    {/* Balance / Returns */}
                    <div className="text-right">
                        <h2 className="text-sm text-gray-400">Balance</h2>
                        <p className="text-xl font-semibold text-green-400">₹12,500</p>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default BalanceComponent;
