import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_KEY = "7e2a905b584040ff9809f7bbd5dd7ed4";

export default function FiltersDropdown({ selectedGenre, onSelectGenre }) {
    const [genres, setGenres] = useState([]);
    const [platforms, setPlatforms] = useState([]);
    const [error, setError] = useState(null);
    const [openGenres, setOpenGenres] = useState(true);
    const [openPlatforms, setOpenPlatforms] = useState(false);
    const [openRating, setOpenRating] = useState(false);
    const [openAlphabetical, setOpenAlphabetical] = useState(false);
    const [showAllGenres, setShowAllGenres] = useState(false);
    const [showAllPlatforms, setShowAllPlatforms] = useState(false);

    const fetchGenres = async () => {
        try {
            const res = await fetch(`https://api.rawg.io/api/genres?key=${API_KEY}`);
            const data = await res.json();
            setGenres(data.results);
        } catch (err) {
            setError("Errore caricamento generi");
        }
    };

    const fetchPlatforms = async () => {
        try {
            const res = await fetch(`https://api.rawg.io/api/platforms?key=${API_KEY}`);
            const data = await res.json();
            setPlatforms(data.results);
        } catch (err) {
            setError("Errore caricamento piattaforme");
        }
    };

    useEffect(() => {
        fetchGenres();
        fetchPlatforms();
    }, []);

    const alphabeticallySortedGenres = [...genres].sort((a, b) => a.name.localeCompare(b.name));
    const topRatedGenres = [...genres].sort((a, b) => b.games_count - a.games_count);

    const limitItems = (arr, showAll) => showAll ? arr : arr.slice(0, 3);

    return (
        <div className="mb-5 space-y-5 text-white">
            {/* GENRES */}
            <div>
                <button onClick={() => setOpenGenres(!openGenres)} className="text-xl font-bold text-indigo-400 mt-5">
                    🎮 Generi {selectedGenre ? `: ${selectedGenre}` : ""} <span>{openGenres ? "▲" : "▼"}</span>
                </button>

                {openGenres && (
                    <ul className="bg-gray-800 mt-2  p-2 space-y-1 max-h-80 overflow-y-auto">
                        {error && <li className="text-red-400">{error}</li>}
                        {limitItems(genres, showAllGenres).map((genre) => (
                            <li key={genre.id}>
                                <Link
                                    to={`/games/${genre.slug}`}
                                    className="block px-2 py-1 hover:bg-gray-700 rounded"
                                    onClick={() => onSelectGenre?.(genre.name)}
                                >
                                    {genre.name}
                                </Link>
                            </li>
                        ))}
                        {genres.length > 3 && (
                            <li>
                                <button
                                    onClick={() => setShowAllGenres(!showAllGenres)}
                                    className="text-sm text-indigo-300 hover:underline"
                                >
                                    {showAllGenres ? "Mostra meno" : "Mostra tutti"}
                                </button>
                            </li>
                        )}
                    </ul>
                )}
            </div>

            {/* PLATFORMS */}
            <div>
                <button onClick={() => setOpenPlatforms(!openPlatforms)} className="text-xl font-bold text-green-400">
                    💻 Piattaforme <span>{openPlatforms ? "▲" : "▼"}</span>
                </button>

                {openPlatforms && (
                    <ul className="bg-gray-800 mt-2 p-2 space-y-1 max-h-80 overflow-y-auto">
                        {limitItems(platforms, showAllPlatforms).map((platform) => (
                            <li key={platform.id}>
                                <Link
                                    to={`/platforms/${platform.id}`}
                                    className="block px-2 py-1 hover:bg-gray-700 rounded"
                                >
                                    {platform.name}
                                </Link>
                            </li>
                        ))}
                        {platforms.length > 3 && (
                            <li>
                                <button
                                    onClick={() => setShowAllPlatforms(!showAllPlatforms)}
                                    className="text-sm text-green-300 hover:underline"
                                >
                                    {showAllPlatforms ? "Mostra meno" : "Mostra tutti"}
                                </button>
                            </li>
                        )}
                    </ul>
                )}
            </div>

            {/* RATING */}
            <div>
                <button onClick={() => setOpenRating(!openRating)} className="text-xl font-bold text-yellow-400">
                    ⭐ Top per Rating <span>{openRating ? "▲" : "▼"}</span>
                </button>

                {openRating && (
                    <ul className="bg-gray-800 mt-2  p-2 space-y-1 max-h-80 overflow-y-auto">
                        {limitItems(topRatedGenres, true).map((genre) => (
                            <li key={genre.id}>
                                <Link
                                    to={`/top-rated/${genre.slug}`}
                                    className="block px-2 py-1 hover:bg-gray-700 rounded"
                                >
                                    {genre.name} ({genre.games_count})
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* ALFABETICO */}
            <div>
                <button onClick={() => setOpenAlphabetical(!openAlphabetical)} className="text-xl font-bold text-pink-400">
                    🔤 Ordine <span>{openAlphabetical ? "▲" : "▼"}</span>
                </button>

                {openAlphabetical && (
                    <ul className="bg-gray-800 mt-2 p-2 space-y-1">
                        <li>
                            <Link
                                to="/order/asc"
                                className="block px-2 py-1 hover:bg-gray-700 rounded"
                                onClick={() => setOpenAlphabetical(false)}
                            >
                                🔤 A → Z
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/order/desc"
                                className="block px-2 py-1 hover:bg-gray-700 rounded"
                                onClick={() => setOpenAlphabetical(false)}
                            >
                                🔠 Z → A
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/order/top"
                                className="block px-2 py-1 hover:bg-gray-700 rounded"
                                onClick={() => setOpenAlphabetical(false)}
                            >
                                ⭐ Più votati
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/order/worst"
                                className="block px-2 py-1 hover:bg-gray-700 rounded"
                                onClick={() => setOpenAlphabetical(false)}
                            >
                                🔻 Meno votati
                            </Link>
                        </li>
                    </ul>
                )}
            </div>

        </div>
    );
}
