import { useState, useEffect, useContext } from "react";
import { supabase } from "../supabase/supabase-client";
import SessionContext from "../context/SessionContext";
import { useNavigate } from "react-router-dom";

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

    // Recupera dati profilo da tabella "profiles"
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
                alert("Errore nel recupero del profilo");
            } finally {
                setLoading(false);
            }
        };

        if (session) getProfile();
    }, [session]);

    // Salva modifiche nel DB
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

        // 1. aggiorna tabella "profiles"
        const { error: profileError } = await supabase.from("profiles").upsert(updates);

        // 2. aggiorna user_metadata in auth.users
        const { error: authError } = await supabase.auth.updateUser({
            data: {
                username: formState.username,
                first_name: formState.first_name,
                last_name: formState.last_name,
            },
        });

        setLoading(false);

        if (profileError || authError) {
            alert("Errore durante l'aggiornamento: " + (profileError?.message || authError?.message));
        } else {
            alert("Profilo aggiornato con successo ✅");
        }
    };

    // Carica avatar su Supabase Storage
    const uploadAvatar = async (event) => {
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

            const { data: publicUrlData } = supabase.storage
                .from("avatars")
                .getPublicUrl(filePath);

            const publicUrl = publicUrlData?.publicUrl;

            setFormState((prev) => ({ ...prev, avatar_url: publicUrl }));
            alert("Avatar aggiornato con successo 🧑‍🎤");
        } catch (error) {
            console.error(error);
            alert("Errore durante il caricamento dell'immagine: " + error.message);
        } finally {
            setUploading(false);
        }
    };

    // Cambia la password utente
    const changePassword = async (e) => {
        e.preventDefault();
        if (!password) {
            alert("Inserisci una nuova password");
            return;
        }

        const { error } = await supabase.auth.updateUser({ password });

        if (error) {
            console.error("Errore cambio password:", error.message);
            alert("Errore nel cambio password: " + error.message);
        } else {
            setPasswordChanged(true);
            alert("Password aggiornata con successo ✅");
            setPassword("");
        }
    };

    // Gestisce i campi del form
    const setField = (field) => (e) =>
        setFormState((prev) => ({ ...prev, [field]: e.target.value }));

    return (
        <div className="max-w-lg mx-auto mt-24 bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-md text-gray-900 dark:text-white">
            <h2 className="text-2xl font-bold mb-6 text-center">Modifica Profilo</h2>
            <form onSubmit={updateProfile} className="space-y-5">
                <div className="flex flex-col items-center gap-3">
                    {formState.avatar_url ? (
                        <img
                            src={formState.avatar_url}
                            alt="Avatar"
                            className="w-24 h-24 rounded-full object-cover border"
                        />
                    ) : (
                        <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-sm text-gray-600">
                            Nessun avatar
                        </div>
                    )}
                    <label className="text-sm font-medium">Cambia Avatar</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={uploadAvatar}
                        disabled={uploading}
                        className="text-sm"
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

            {/* Sezione cambio password */}
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
        </div>
    );
}
