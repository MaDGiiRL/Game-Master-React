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
        <div className="max-w-xl mx-auto mt-24 bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-md text-gray-900 dark:text-white">
            <h2 className="text-2xl font-bold mb-6 text-center">Modifica Profilo</h2>
            <form onSubmit={updateProfile} className="space-y-5">
                <div className="flex flex-col items-center gap-3">
                    <Avatar
                        url={formState.avatar_url}
                        size={100}
                        onUpload={(event, path) => setFormState((prev) => ({ ...prev, avatar_url: path }))}
                    />
                </div>

                <div>
                    <label htmlFor="email" className="block mb-1 font-medium">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={session?.user?.email || ""}
                        disabled
                        className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 cursor-not-allowed"
                    />
                </div>

                <div>
                    <label htmlFor="username" className="block mb-1 font-medium">Username</label>
                    <input
                        type="text"
                        id="username"
                        value={formState.username}
                        onChange={setField("username")}
                        required
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label htmlFor="first_name" className="block mb-1 font-medium">Nome</label>
                    <input
                        type="text"
                        id="first_name"
                        value={formState.first_name}
                        onChange={setField("first_name")}
                        required
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label htmlFor="last_name" className="block mb-1 font-medium">Cognome</label>
                    <input
                        type="text"
                        id="last_name"
                        value={formState.last_name}
                        onChange={setField("last_name")}
                        required
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition"
                    >
                        {loading ? "Salvataggio in corso..." : "Salva modifiche"}
                    </button>
                </div>
            </form>

            {/* Cambio password */}
            <form onSubmit={changePassword} className="mt-8 border-t border-gray-300 dark:border-gray-700 pt-6 space-y-4">
                <h3 className="text-lg font-semibold mb-2">Cambia Password</h3>
                <div>
                    <label htmlFor="password" className="block mb-1 font-medium">Nuova Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                </div>
                <button
                    type="submit"
                    className="py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition"
                >
                    Cambia Password
                </button>
                {passwordChanged && (
                    <p className="text-sm text-green-500">Password aggiornata!</p>
                )}
            </form>

            {/* Preferiti */}
            <div className="mt-12">
                <h2 className="text-xl font-bold mb-4">
                    Hey {session?.user.user_metadata.first_name}, i tuoi giochi preferiti 🎮
                </h2>

                {favorites.length === 0 ? (
                    <p className="text-sm text-gray-500">Non ci sono favoriti al momento...</p>
                ) : (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {Array.from(
                                new Map(favorites.map((game) => [game.game_id, game])).values()
                            )
                                .slice(0, showAllFavorites ? undefined : 8)
                                .map((game) => (
                                    <div
                                        key={game.game_id}
                                        onClick={() => navigate(`/games/${game.slug}/${game.game_id}`)}
                                        className="cursor-pointer bg-gray-100 dark:bg-gray-800 p-2 rounded-lg relative shadow hover:shadow-md transition"
                                    >
                                        <img
                                            src={game.game_image}
                                            alt={game.game_name}
                                            className="w-full h-28 object-cover rounded-md mb-1"
                                        />
                                        <p className="text-xs font-semibold truncate mb-1">{game.game_name}</p>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation(); // previene la navigazione quando si clicca su rimuovi
                                                removeFavorite(game.game_id);
                                            }}
                                            className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                                            title="Rimuovi"
                                        >
                                            <FaTrashAlt />
                                        </button>
                                    </div>
                                ))}

                        </div>

                        {favorites.length > 8 && (
                            <div className="flex justify-center mt-4">
                                <button
                                    onClick={() => setShowAllFavorites((prev) => !prev)}
                                    className="text-sm text-indigo-600 hover:underline"
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
