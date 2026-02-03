import { useNavigate } from "react-router-dom";

function NavbarComponent() {
    const navigate = useNavigate();

    return (
        <nav className="bg-slate-800 border-b border-slate-700 h-16 flex items-center justify-between px-6 sticky top-0 z-50">

            {/* Middle - App Name */}
            <div className="flex-1 flex justify-center">
                <button onClick={() => { navigate("/"); }}
                className="text-2xl font-bold text-white tracking-wider">
                    CBRICS
                </button>
            </div>

            {/* Right - Profile Symbol */}
            <div className="flex items-center">
                <button onClick={() => { navigate("/profile"); }}
                className="w-10 h-10 rounded-full bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center hover:shadow-lg hover:shadow-blue-500/50 transition-all cursor-pointer">
                    <span className="text-white font-semibold text-lg">👤</span>
                </button>
            </div>
        </nav>
    )
}

export default NavbarComponent;