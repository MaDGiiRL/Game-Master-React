import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabase/supabase-client";
import logo from "../public/logo.png";
import SessionContext from "../context/SessionContext";
import Swal from "sweetalert2";

export default function Header() {
    const [user, setUser] = useState(null);
    const [avatarUrl, setAvatarUrl] = useState(null);
    const navigate = useNavigate();
    const { session } = useContext(SessionContext);

    useEffect(() => {
        const getUser = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();
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

    // Funzione per scaricare avatar e generare URL blob
    const downloadAvatar = async (url) => {
        if (!url) {
            setAvatarUrl(null);
            return;
        }

        try {
            const extractPathFromUrl = (url) => {
                try {
                    const urlObj = new URL(url);
                    const pathname = urlObj.pathname;
                    const parts = pathname.split('/avatars/');
                    if (parts.length > 1) return parts[1];
                    return url;
                } catch {
                    return url;
                }
            };

            const path = extractPathFromUrl(url);
            const { data, error } = await supabase.storage.from('avatars').download(path);
            if (error) throw error;
            const imageUrl = URL.createObjectURL(data);
            setAvatarUrl(imageUrl);
        } catch (error) {
            console.error('Errore download avatar:', error.message);
            setAvatarUrl(null);
        }
    };

    // Scarica avatar quando cambia user
    useEffect(() => {
        if (user?.user_metadata?.avatar_url) {
            downloadAvatar(user.user_metadata.avatar_url);
        } else {
            setAvatarUrl(null);
        }
    }, [user]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        Swal.fire({
            icon: "success",
            title: "Logout effettuato",
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
        });
        navigate("/");
    };


    return (
        <header className="top-0 w-full z-50 bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 shadow-xl">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <Link
                    to="/"
                    className="flex items-center space-x-3 transform transition-transform duration-300 hover:scale-110"
                    aria-label="Torna alla home"
                >
                    <img src={logo} alt="Logo Game Master" style={{ width: "52px" }} className="rounded-full" />
                    <h1 className="text-3xl font-extrabold tracking-wide text-white select-none">
                        Game <span className="text-purple-400 drop-shadow-md">Master</span>
                    </h1>

                </Link>

                <nav className="flex space-x-6 items-center text-sm font-semibold">
                    {user ? (
                        <>
                            <Link
                                to="/account"
                                className="flex items-center gap-2 text-indigo-300 hover:text-white transition-colors duration-300 group relative"
                                aria-label="Profilo utente"
                            >
                                {avatarUrl ? (
                                    <img
                                        src={avatarUrl}
                                        alt="Avatar utente"
                                        className="w-8 h-8 rounded-full object-cover group-hover:animate-bounce"
                                        title="Profilo"
                                    />
                                ) : (
                                    <span
                                        aria-hidden="true"
                                        className="text-xl group-hover:animate-bounce"
                                        title="Profilo"
                                    >
                                        👤
                                    </span>
                                )}

                                <span className="truncate max-w-[140px]">
                                    {user.user_metadata?.username || user.email}
                                </span>

                                <span className="absolute -top-1 -right-3 inline-block w-3 h-3 bg-green-400 rounded-full ring-2 ring-white animate-pulse" />
                            </Link>

                            <button
                                onClick={handleLogout}
                                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 transition-all px-6 py-2 rounded-full text-white shadow-lg shadow-pink-500/50 hover:shadow-pink-600/70 transform active:scale-95 focus:outline-none focus:ring-4 focus:ring-pink-400"
                                aria-label="Logout"
                                title="Logout"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="px-6 py-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-700/50 transition-transform transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-indigo-400"
                                aria-label="Login"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="px-6 py-2 rounded-full border-2 border-pink-400 text-pink-400 hover:bg-pink-400 hover:text-white transition-colors shadow-sm hover:shadow-pink-400/50 focus:outline-none focus:ring-4 focus:ring-pink-400"
                                aria-label="Registrati"
                            >
                                Registrati
                            </Link>
                        </>
                    )}

                </nav>

            </div>

            <div className="h-1 bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-600 animate-gradient-x" />

            <style>{`
        @keyframes gradient-x {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 6s ease infinite;
        }
      `}</style>
        </header>
    );
}
