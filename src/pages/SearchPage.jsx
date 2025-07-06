import { useEffect } from "react";
import { useSearchParams } from "react-router";
import useFetchSolution from "../hook/useFetchSolution";
import CardGame from "../components/CardGame";


export default function SearchPage() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("query"); // ✅ CORRETTO

    const initialUrl = `https://api.rawg.io/api/games?key=9269195f491e44539d7a2d10ce87ab15&search=${query}`;

    const { loading, data, error, updateUrl } = useFetchSolution(initialUrl);

    useEffect(() => {
        updateUrl(initialUrl);
    }, [initialUrl, updateUrl]);

    return (
        <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold text-white mb-6">
                🔎 Risultati per: <span className="text-indigo-400">{query}</span>
            </h1>

            {loading && <p className="text-gray-300">Caricamento...</p>}
            {error && <h1 className="text-red-500">{error}</h1>}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {data &&
                    data.results.map((game) => (
                        <CardGame key={game.id} game={game} />
                    ))}
            </div>
        </div>
    );
}
