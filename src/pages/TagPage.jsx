import { useState, useEffect } from "react";
import { useParams } from "react-router";
import CardGame from "../components/CardGame";

export default function TagPage() {
    const { tag } = useParams();

    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    const initialUrl = `https://api.rawg.io/api/games?key=9269195f491e44539d7a2d10ce87ab15&tags=${tag}&page=1`;

    const load = async () => {
        try {
            const response = await fetch(initialUrl);
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            const json = await response.json();
            setData(json);
        } catch (error) {
            setError(error.message);
            setData(null);
        }
    };

    useEffect(() => {
        load();
    }, [tag]);

    return (
        <>
            <h1 className="text-5xl font-bold mb-2 cursor-pointer mt-10 text-center uppercase" style={{ marginTop: 50, marginBottom: 70 }}>
                🏷️ Giochi con tag <span className="text-indigo-400">{tag}</span> 🏷️
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 px-4">
                {error && <article className="text-red-500">{error}</article>}
                {data && data.results.map((game) => (
                    <CardGame key={game.id} game={game} />
                ))}
            </div>
        </>
    );
}
