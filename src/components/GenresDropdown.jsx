import { useState, useEffect } from "react";

export default function GenresDropdown({ selectedGenre, onSelectGenre }) {
    const [genres, setGenres] = useState(null);
    const [error, setError] = useState(null);

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
        <details className="dropdown">
            <summary className="text-xl font-bold text-indigo-400 mb-2 cursor-pointer">
                🎮 Generi {selectedGenre ? `: ${selectedGenre}` : ""}
            </summary>
            {error && <small className="text-red-400">{error}</small>}
            <ul className="bg-gray-800 text-white mt-2 rounded shadow-lg max-h-100 overflow-y-auto p-2">
                {/* Opzione per rimuovere filtro */}
                <li
                    className={`cursor-pointer px-2 py-1 rounded ${selectedGenre === null ? "bg-indigo-600" : "hover:bg-indigo-500"
                        }`}
                    onClick={() => onSelectGenre(null)}
                >
                    Tutti
                </li>

                {genres && genres.results.map((genre) => (
                    <li
                        key={genre.id}
                        className={`cursor-pointer px-2 py-1 rounded ${selectedGenre === genre.name ? "bg-indigo-600" : "hover:bg-indigo-500"
                            }`}
                        onClick={() => onSelectGenre(genre.name)}
                    >
                        {genre.name}
                    </li>
                ))}
            </ul>
        </details>
    );
}
