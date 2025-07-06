import { useState, useEffect } from "react";
import { Link } from "react-router";

export default function GenresDropdown({ selectedGenre, onSelectGenre }) {
    const [genres, setGenres] = useState(null);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(true);

    const initialUrl = "https://api.rawg.io/api/genres?key=7e2a905b584040ff9809f7bbd5dd7ed4";

    const load = async () => {
        try {
            const response = await fetch(initialUrl);
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            const json = await response.json();
            setGenres(json);
        } catch (error) {
            setError(error.message);
            setGenres(null);
        }
    };

    useEffect(() => {
        load();
    }, []);

    return (
        <div className="mb-4">
            <button
                onClick={() => setOpen(!open)}
                className="text-xl font-bold text-indigo-400 cursor-pointer"
            >
                🎮 Generi {selectedGenre ? `: ${selectedGenre}` : ""}
                <span className="ml-2">{open ? "▲" : "▼"}</span>
            </button>

            {open && (
                <ul className="bg-gray-800 text-white mt-2 rounded shadow-lg p-2">
                    {error && <li className="text-red-400">{error}</li>}
                    {genres?.results.map((genre) => (
                        <li key={genre.id}>
                            <Link
                                to={`/games/${genre.slug}`}
                                className="block px-2 py-1 hover:bg-gray-700 rounded"
                                onClick={() => onSelectGenre?.(genre.name)} // opzionale
                            >
                                {genre.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
