import { useState, useEffect } from "react";
export default function GenresDropdown() {
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
    }

    useEffect(() => {
        load();
    }, []);

    return (
        <>

            <details className="dropdown">
                <summary className="text-xl font-bold text-indigo-400 mb-2">🎮 Generi</summary>
                {error && <small>{error}</small>}
                <ul>
                    {genres && genres.results.map((genre) => (
                        <li key={genre.id}>{genre.name}</li>
                    ))}
                </ul>
            </details>
        </>
    )

}