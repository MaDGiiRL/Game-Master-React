import { useContext, useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import FavoritesContext from "../context/FavoritesContext";

export default function ToggleFavorite({ data }) {
    const { favorites, addFavorites, removeFavorite } = useContext(FavoritesContext);
    const [isFav, setIsFav] = useState(false);

    useEffect(() => {
        const found = favorites.find((el) => +el.game_id === data?.id);
        setIsFav(!!found);
    }, [favorites, data]);

    const toggleFavorite = () => {
        if (isFav) {
            removeFavorite(data.id);
        } else {
            addFavorites(data);
        }
        setIsFav((prev) => !prev);
    };

    return (
        <button
            onClick={toggleFavorite}
            className="text-xl transition duration-200 hover:scale-110"
            aria-label="Toggle favorite"
        >
            {isFav ? (
                <FaHeart className="text-red-500" />
            ) : (
                <FaRegHeart className="text-white" />
            )}
        </button>
    );
}
