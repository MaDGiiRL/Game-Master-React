import { useState, useEffect, useContext, useCallback } from "react";
import { supabase } from "../supabase/supabase-client";
import SessionContext from "./SessionContext";
import FavoritesContext from "./FavoritesContext";

export default function FavoritesProvider({ children }) {
    const { session } = useContext(SessionContext);
    const [favorites, setFavorites] = useState([]);

    const getFavorites = useCallback(async () => {
        if (!session?.user?.id) return;
        let { data: favourites, error } = await supabase
            .from("favorites")
            .select("*")
            .eq("user_id", session.user.id);

        if (error) {
            console.error("Errore nel recupero preferiti:", error);
        } else {
            setFavorites(favourites);
        }
    }, [session]);

    const addFavorites = async (game) => {
        if (!session?.user?.id) return;
        const { data, error } = await supabase
            .from("favorites")
            .insert([
                {
                    user_id: session.user.id,
                    game_id: game.id,
                    game_name: game.name,
                    game_image: game.background_image,
                },
            ])
            .select();

        if (error) {
            console.error("Errore nell'aggiunta preferito:", error);
        } else {
            setFavorites((prev) => [...prev, data[0]]);
        }
    };

    const removeFavorite = async (gameId) => {
        if (!session?.user?.id) return;
        const { error } = await supabase
            .from("favorites")
            .delete()
            .eq("game_id", gameId)
            .eq("user_id", session.user.id);

        if (error) {
            console.error("Errore nella rimozione preferito:", error);
        } else {
            setFavorites((prev) => prev.filter((fav) => fav.game_id !== gameId));
        }
    };

    useEffect(() => {
        if (session) {
            getFavorites();
        }


        const channel = supabase
            .channel("favorites")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "favorites",
                    filter: `user_id=eq.${session?.user?.id}`,
                },
                (payload) => {
                    getFavorites();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [getFavorites, session]);

    return (
        <FavoritesContext.Provider
            value={{
                favorites,
                addFavorites,
                removeFavorite,
            }}
        >
            {children}
        </FavoritesContext.Provider>
    );
}
