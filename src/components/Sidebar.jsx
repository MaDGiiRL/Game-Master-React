import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { supabase } from "../supabase/supabase-client";
import SearchBar from './SearchBar';
import GenresDropdown from './GenresDropdown';
import logo from "../public/logo.png";

export default function Sidebar() {
    const [open, setOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [avatarUrl, setAvatarUrl] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();

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

    const handleLinkClick = (closeDropdown = false) => {
        setOpen(false);
        if (closeDropdown) setDropdownOpen(false);
    };

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
        handleLinkClick(true);
    };

    return (
        <div className="md:flex flex-col md:flex-row md:min-h-screen w-full shadow-lg">
            <div className="flex flex-col w-full md:w-72 text-gray-700 bg-white dark:text-gray-200 dark:bg-gray-800 flex-shrink-0 pt-1">
                <div className="flex-shrink-0 px-8 py-6 flex flex-row items-center justify-between">
                    <Link
                        to="/"
                        onClick={() => handleLinkClick()}
                        className="flex items-center space-x-3 transform transition-transform duration-300 hover:scale-110"
                        aria-label="Torna alla home"
                    >
                        <img src={logo} alt="Logo Game Master" style={{ width: "42px" }} className="rounded-full" />
                        <h1 className="text-2xl font-extrabold tracking-wide text-white select-none text-center md:text-left">
                            Game <span className="text-purple-400 drop-shadow-md">Master</span>
                        </h1>
                    </Link>
                    <button
                        className="rounded-lg md:hidden focus:outline-none focus:shadow-outline"
                        onClick={() => setOpen(!open)}
                        aria-label="Toggle menu"
                    >
                        <svg fill="currentColor" viewBox="0 0 20 20" className="w-6 h-6">
                            {!open ? (
                                <path
                                    fillRule="evenodd"
                                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z"
                                    clipRule="evenodd"
                                />
                            ) : (
                                <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            )}
                        </svg>
                    </button>
                </div>

                <nav className={`${open ? 'block' : 'hidden'} flex-grow md:block px-4 pb-4 md:pb-0 md:overflow-y-auto`}>
                    {user ? (
                        <div className="relative mt-4">
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center justify-between w-full px-4 py-3 text-sm font-semibold text-left bg-transparent rounded-lg dark:text-white dark:hover:bg-gray-700 hover:bg-gray-100 transition"
                            >
                                <div className="flex items-center gap-2 truncate max-w-[190px]">
                                    {avatarUrl ? (
                                        <img src={avatarUrl} alt="Avatar" className="w-8 h-8 rounded-full object-cover" />
                                    ) : (
                                        <span className="text-xl">👤</span>
                                    )}
                                    <span className="truncate">{user.user_metadata?.username || user.email}</span>
                                </div>
                                <svg
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    className={`w-4 h-4 ml-2 transition-transform ${dropdownOpen ? 'rotate-180' : 'rotate-0'}`}
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>
                            {dropdownOpen && (
                                <div className="absolute right-0 w-full mt-2 origin-top-right rounded-md shadow-lg z-50">
                                    <div className="px-2 py-2 bg-white rounded-md shadow dark:bg-gray-800">
                                        <Link
                                            to="/account"
                                            onClick={() => handleLinkClick(true)}
                                            className="block px-4 py-2 text-sm text-gray-800 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition"
                                        >
                                            Profilo
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-100 dark:hover:bg-red-600 hover:text-white rounded-md transition"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="mb-1 flex flex-col items-center gap-2 pt-5 min-h-[80px]">
                            <div className="flex gap-4 justify-center">
                                <Link
                                    to="/login"
                                    onClick={() => handleLinkClick()}
                                    className="px-6 py-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-transform transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-indigo-400"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    onClick={() => handleLinkClick()}
                                    className="px-6 py-2 rounded-full border-2 border-indigo-500 text-white hover:bg-indigo-500 hover:text-white transition-colors shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-400"
                                >
                                    Registrati
                                </Link>
                            </div>
                        </div>
                    )}

                    <div>
                        <GenresDropdown />
                    </div>

                    <div className="mt-10">
                        <SearchBar />
                    </div>

                    <Link
                        to="/stores"
                        onClick={() => handleLinkClick()}
                        className="block bg-indigo-600 hover:bg-indigo-700 text-white text-center py-2 mt-4 rounded-md font-semibold transition"
                    >
                        🛒 Vedi tutti gli Stores
                    </Link>
                </nav>
            </div>
        </div>
    );
}