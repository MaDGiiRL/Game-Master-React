import { useState, useEffect, useContext } from "react";
import { supabase } from "../supabase/supabase-client";
import SessionContext from "../context/SessionContext";
import { useNavigate } from "react-router-dom";
import FavoritesContext from "../context/FavoritesContext";
import { FaTrashAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import Avatar from "../components/Avatar";

export default function AccountPage() {
    const { session } = useContext(SessionContext);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [formState, setFormState] = useState({
        username: "",
        first_name: "",
        last_name: "",
        avatar_url: "",
    });
    const [password, setPassword] = useState("");
    const [passwordChanged, setPasswordChanged] = useState(false);

    const navigate = useNavigate();
    const { favorites, removeFavorite } = useContext(FavoritesContext);
    const [showAllFavorites, setShowAllFavorites] = useState(false);

    useEffect(() => {
        const getProfile = async () => {
            try {
                setLoading(true);
                const { user } = session;
                const { data, error } = await supabase
                    .from("profiles")
                    .select("username, first_name, last_name, avatar_url")
                    .eq("id", user.id)
                    .single();

                if (error) throw error;

                if (data) {
                    setFormState({
                        username: data.username || "",
                        first_name: data.first_name || "",
                        last_name: data.last_name || "",
                        avatar_url: data.avatar_url || "",
                    });
                }
            } catch (error) {
                console.error("Errore nel recupero del profilo:", error.message);
                Swal.fire({ icon: "error", title: "Errore", text: "Errore nel recupero del profilo" });
            } finally {
                setLoading(false);
            }
        };
        if (session) getProfile();
    }, [session]);

    const updateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        const { user } = session;
        const updates = {
            id: user.id,
            username: formState.username,
            first_name: formState.first_name,
            last_name: formState.last_name,
            avatar_url: formState.avatar_url,
            updated_at: new Date(),
        };

        const { error: profileError } = await supabase.from("profiles").upsert(updates);
        const { error: authError } = await supabase.auth.updateUser({
            data: {
                username: formState.username,
                first_name: formState.first_name,
                last_name: formState.last_name,
            },
        });

        setLoading(false);

        if (profileError || authError) {
            Swal.fire({
                icon: "error",
                title: "Errore aggiornamento",
                text: profileError?.message || authError?.message || "Errore sconosciuto",
            });
        } else {
            Swal.fire({
                icon: "success",
                title: "Profilo aggiornato",
                text: "Le modifiche sono state salvate correttamente!",
            });
        }
    };

    const changePassword = async (e) => {
        e.preventDefault();
        if (!password) {
            Swal.fire({
                icon: "warning",
                title: "Password mancante",
                text: "Inserisci una nuova password prima di continuare.",
            });
            return;
        }

        const { error } = await supabase.auth.updateUser({ password });

        if (error) {
            console.error("Errore cambio password:", error.message);
            Swal.fire({
                icon: "error",
                title: "Errore cambio password",
                text: error.message || "Errore sconosciuto",
            });
        } else {
            setPasswordChanged(true);
            setPassword("");
            Swal.fire({
                icon: "success",
                title: "Password aggiornata",
                text: "Hai aggiornato correttamente la password.",
            });
        }
    };

    const setField = (field) => (e) =>
        setFormState((prev) => ({ ...prev, [field]: e.target.value }));

    const handleAvatarUpload = async (event) => {
        try {
            setUploading(true);
            if (!event.target.files || event.target.files.length === 0) {
                throw new Error("Devi selezionare un'immagine");
            }

            const file = event.target.files[0];
            const fileExt = file.name.split(".").pop();
            const fileName = `${session.user.id}-${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from("avatars")
                .upload(filePath, file, { upsert: true });

            if (uploadError) throw uploadError;

            setFormState((prev) => ({ ...prev, avatar_url: filePath }));

            Swal.fire({
                icon: "success",
                title: "Avatar aggiornato",
                text: "Il tuo nuovo avatar è stato salvato con successo!",
            });
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: "error",
                title: "Errore caricamento",
                text: error.message || "Errore durante l'upload dell'immagine",
            });
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-20 p-8 bg-white dark:bg-gray-900 rounded-3xl shadow-xl text-gray-900 dark:text-white">
            <h2 className="text-3xl font-extrabold mb-10 text-center tracking-wide">
                Modifica Profilo
            </h2>

            <form onSubmit={updateProfile} className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Colonna Avatar */}
                <div className="flex flex-col items-center pt-15">
                    <Avatar
                        url={formState.avatar_url}
                        size={250}
                        onUpload={(event, path) =>
                            setFormState((prev) => ({ ...prev, avatar_url: path }))
                        }
                    />
                    <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center max-w-xs">
                        Clicca sull'avatar per caricare una nuova immagine.
                    </p>
                </div>

                {/* Colonna Form */}
                <div className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block mb-2 font-semibold text-indigo-600">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={session?.user?.email || ""}
                            disabled
                            className="w-full px-5 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 cursor-not-allowed"
                        />
                    </div>

                    <div>
                        <label htmlFor="username" className="block mb-2 font-semibold text-indigo-600">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            value={formState.username}
                            onChange={setField("username")}
                            required
                            className="w-full px-5 py-3 rounded-xl border border-gray-300 dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-4 focus:ring-indigo-400 dark:focus:ring-indigo-600 transition"
                        />
                    </div>

                    <div>
                        <label htmlFor="first_name" className="block mb-2 font-semibold text-indigo-600">
                            Nome
                        </label>
                        <input
                            type="text"
                            id="first_name"
                            value={formState.first_name}
                            onChange={setField("first_name")}
                            required
                            className="w-full px-5 py-3 rounded-xl border border-gray-300 dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-4 focus:ring-indigo-400 dark:focus:ring-indigo-600 transition"
                        />
                    </div>

                    <div>
                        <label htmlFor="last_name" className="block mb-2 font-semibold text-indigo-600">
                            Cognome
                        </label>
                        <input
                            type="text"
                            id="last_name"
                            value={formState.last_name}
                            onChange={setField("last_name")}
                            required
                            className="w-full px-5 py-3 rounded-xl border border-gray-300 dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-4 focus:ring-indigo-400 dark:focus:ring-indigo-600 transition"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-6 py-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl text-white font-bold text-lg shadow-lg transition"
                    >
                        {loading ? "Salvataggio in corso..." : "Salva modifiche"}
                    </button>
                </div>
            </form>

            {/* Cambio Password */}
            <form
                onSubmit={changePassword}
                className="mt-12 border-t border-gray-300 dark:border-gray-700 pt-10 space-y-6 max-w-200 mx-auto"
            >
                <h3 className="text-xl font-bold text-center mb-6 text-indigo-600">
                    Cambia Password
                </h3>

                <div>
                    <label htmlFor="password" className="block mb-2 font-semibold text-gray-700 dark:text-gray-300">
                        Nuova Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-5 py-3 rounded-xl border border-gray-300 dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-4 focus:ring-red-400 dark:focus:ring-red-600 transition"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full py-3 bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-xl text-white font-semibold shadow-md transition"
                >
                    Cambia Password
                </button>

                {passwordChanged && (
                    <p className="text-center text-green-500 font-medium">Password aggiornata!</p>
                )}
            </form>

            {/* Preferiti */}
            <div className="mt-16 max-w-5xl mx-auto">
                <h2 className="text-2xl font-extrabold mb-6  text-center">
                    Hey <span className=" text-indigo-600">{session?.user.user_metadata.first_name}</span>, i tuoi giochi preferiti 🎮
                </h2>

                {favorites.length === 0 ? (
                    <p className="text-center text-gray-500 dark:text-gray-400 text-lg">
                        Non ci sono favoriti al momento...
                    </p>
                ) : (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                            {Array.from(
                                new Map(favorites.map((game) => [game.game_id, game])).values()
                            )
                                .slice(0, showAllFavorites ? undefined : 8)
                                .map((game) => (
                                    <div
                                        key={game.game_id}
                                        onClick={() => navigate(`/games/${game.slug}/${game.game_id}`)}
                                        className="cursor-pointer bg-gray-100 dark:bg-gray-800 p-3 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-1 transition"
                                    >
                                        <img
                                            src={game.game_image}
                                            alt={game.game_name}
                                            className="w-full h-32 object-cover rounded-md mb-3"
                                        />
                                        <p className="text-sm font-semibold truncate text-gray-900 dark:text-white mb-1">
                                            {game.game_name}
                                        </p>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeFavorite(game.game_id);
                                            }}
                                            className="absolute top-3 right-3 text-red-600 hover:text-red-800"
                                            title="Rimuovi"
                                            aria-label={`Rimuovi ${game.game_name} dai preferiti`}
                                        >
                                            <FaTrashAlt size={18} />
                                        </button>
                                    </div>
                                ))}
                        </div>

                        {favorites.length > 8 && (
                            <div className="flex justify-center mt-8">
                                <button
                                    onClick={() => setShowAllFavorites((prev) => !prev)}
                                    className="text-indigo-600 hover:underline font-semibold"
                                >
                                    {showAllFavorites ? "Mostra meno" : "Mostra tutti"}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );


}
