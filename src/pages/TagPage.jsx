import { useEffect } from "react";
import { useParams } from "react-router";
import CardGame from "../components/CardGame";
import useFetchSolution from "../hook/useFetchSolution";


export default function TagPage() {
    const { tag } = useParams();

    const {
        data,
        error,
        loading,
        updateUrl,
    } = useFetchSolution(`https://api.rawg.io/api/games?key=9269195f491e44539d7a2d10ce87ab15&tags=${tag}&page=1`);

    useEffect(() => {
        updateUrl(`https://api.rawg.io/api/games?key=9269195f491e44539d7a2d10ce87ab15&tags=${tag}&page=1`);
    }, [tag, updateUrl]);

    return (
        <>
            <h1 className="text-5xl font-bold mb-2 cursor-pointer mt-10 text-center uppercase" style={{ marginTop: 50, marginBottom: 70 }}>
                🏷️ Giochi con tag <span className="text-indigo-400">{tag}</span> 🏷️
            </h1>

            {loading && <p className="text-center text-white">Caricamento in corso...</p>}
            {error && <article className="text-red-500 text-center">{error}</article>}

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 px-4">
                {data && data.results.map((game) => (
                    <CardGame key={game.id} game={game} />
                ))}
            </div>
        </>
    );
}
