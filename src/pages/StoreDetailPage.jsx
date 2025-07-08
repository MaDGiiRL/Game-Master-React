import { useEffect } from "react";
import { useParams } from "react-router-dom";
import useFetchSolution from "../hook/useFetchSolution";
import CardGame from "../components/CardGame";

export default function StoreDetailPage() {
    const { storeId } = useParams();
    const apiKey = "9269195f491e44539d7a2d10ce87ab15";

    const url = `https://api.rawg.io/api/games?key=${apiKey}&stores=${storeId}&page=1`;

    const { data, error, loading, updateUrl } = useFetchSolution(url);

    useEffect(() => {
        updateUrl(url);
    }, [url, updateUrl]);

    return (
        <>
            <h1 className="text-5xl font-bold mb-10 text-center uppercase mt-10" style={{ marginTop: 50, marginBottom: 70 }}>
                Giochi nello Store #{storeId}
            </h1>

            {loading && <p className="text-center text-white">Loading...</p>}
            {error && <article className="text-red-500 text-center">{error}</article>}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
                {data && data.results.map(game => (
                    <CardGame key={game.id} game={game} />
                ))}
            </div>
        </>
    );
}
