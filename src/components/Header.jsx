import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabase/supabase-client";
import logo from "../public/logo.png";
import SessionContext from "../context/SessionContext";
import Swal from "sweetalert2";

export default function Header() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const { session } = useContext(SessionContext);

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };

        getUser();

        const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user || null);
        });

        return () => {
            listener.subscription.unsubscribe();
        };
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        Swal.fire({
            icon: 'success',
            title: 'Logout effettuato',
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
        });
        navigate("/");
    };

    return (
        <header className="bg-gradient-to-r from-gray-900 to-gray-800 text-white fixed top-0 w-full z-50 mb-5">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <Link to="/" className="flex items-center space-x-2 hover:opacity-90 transition-opacity">
                    <img src={logo} alt="Logo" style={{ width: '50px' }} />
                    <h1 className="text-3xl font-bold tracking-tight text-white cursor-pointer">
                        Game <span className="text-indigo-500">Master</span>
                    </h1>
                </Link>

                <div className="flex space-x-4 items-center">
                    {user ? (
                        <>
                            <Link
                                to="/account"
                                className="flex items-center gap-1 text-sm font-medium text-indigo-300 hover:underline hover:text-indigo-100 transition-colors"
                            >
                                <span className="text-lg">👤</span>
                                {user.user_metadata?.username || user.email}
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="bg-red-600 hover:bg-red-700 transition-colors text-sm font-medium px-5 py-2 rounded-xl shadow-lg"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="bg-indigo-600 hover:bg-indigo-700 transition-colors text-sm font-medium px-5 py-2 rounded-xl shadow-lg"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="bg-transparent border border-indigo-500 text-indigo-400 hover:bg-indigo-600 hover:text-white transition-colors text-sm font-medium px-5 py-2 rounded-xl shadow-lg"
                            >
                                Registrati
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
