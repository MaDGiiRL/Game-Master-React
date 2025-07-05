import { useEffect, useState } from "react";
import CardGame from "../components/CardGame";

export default function Home() {

    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    const initialUrl = "https://api.rawg.io/api/games?key=7e2a905b584040ff9809f7bbd5dd7ed4&dates=2024-01-01,2024-12-31&page=1";

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
    }

    useEffect(() => {
        load();
    }, []);

    return (

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6 my-5">
            {error && <article>{error}</article>}
            {data && data.results.map((game) => (
                <CardGame key={game.id} game={game} />
            ))}
        </div>

    );
}