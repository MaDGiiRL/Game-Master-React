import { useEffect } from "react";
import { useParams } from "react-router";
import CardGame from "../components/CardGame";
import useFetchSolution from "../hook/useFetchSolution";

export default function TopRatedPage() {
    const { genre } = useParams();

    const {
        data,
        error,
        loading,
        updateUrl,
    } = useFetchSolution(`https://api.rawg.io/api/games?key=7e2a905b584040ff9809f7bbd5dd7ed4&genres=${genre}&ordering=-rating&page=1`);

    useEffect(() => {
        updateUrl(`https://api.rawg.io/api/games?key=7e2a905b584040ff9809f7bbd5dd7ed4&genres=${genre}&ordering=-rating&page=1`);
    }, [genre, updateUrl]);

    return (
        <>
            <h1 className="text-4xl font-bold text-yellow-400 text-center my-10 uppercase" style={{ marginTop: 50, marginBottom: 70 }}>
                ⭐ Migliori giochi in {genre}
            </h1>

            {loading && <p className="text-white text-center">Loading...</p>}
            {error && <p className="text-red-500 text-center">{error}</p>}

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 px-4">
                {data?.results.map((game) => (
                    <CardGame key={game.id} game={game} />
                ))}
            </div>
        </>
    );
}
