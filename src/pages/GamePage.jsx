import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import useFetchSolution from "../hook/useFetchSolution";

export default function GamePage() {
    const { id } = useParams();
    const {
        data,
        error,
        loading,
        updateUrl,
    } = useFetchSolution(
        `https://api.rawg.io/api/games/${id}?key=9269195f491e44539d7a2d10ce87ab15`
    );

    useEffect(() => {
        updateUrl(
            `https://api.rawg.io/api/games/${id}?key=9269195f491e44539d7a2d10ce87ab15`
        );
    }, [id, updateUrl]);


    const [showFull, setShowFull] = useState(false);
    const DESCRIPTION_LIMIT = 800;

    const renderDescription = () => {
        if (!data.description_raw) return null;
        const text = data.description_raw;
        if (text.length <= DESCRIPTION_LIMIT) {
            return <p className="text-gray-300 leading-relaxed text-justify">{text}</p>;
        }
        const shortText = text.slice(0, DESCRIPTION_LIMIT) + "...";
        return (
            <div className="text-gray-300">
                <p className="leading-relaxed text-justify">
                    {showFull ? text : shortText}
                </p>
                <button
                    onClick={() => setShowFull((v) => !v)}
                    className="mt-2 text-indigo-400 hover:text-indigo-200 font-medium text-xl"
                >
                    {showFull ? "Show less" : "Show more"}
                </button>
            </div>
        );
    };

    return (
        <>
            {loading && (
                <h1 className="text-indigo-300 text-xl text-center mt-10">Loading...</h1>
            )}
            {error && (
                <h1 className="text-red-400 text-xl text-center mt-10">{error}</h1>
            )}

            {data && (
                <section
                    className="max-w-6xl mx-auto px-4 py-16 text-white"
                    style={{ marginTop: 50 }}
                >
                    {/* Immagine + Info principali */}
                    <div className="flex flex-col md:flex-row gap-10 mb-12">
                        <div className="flex-shrink-0 w-full md:w-1/2 h-[400px] rounded-2xl overflow-hidden shadow-lg relative">
                            <img
                                src={data.background_image}
                                alt={data.name}
                                className="w-full h-full object-cover opacity-90"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                        </div>

                        <div className="flex flex-col justify-center gap-6 md:w-1/2">
                            <h1 className="text-4xl font-bold mb-2 text-indigo-400">
                                {data.name}
                            </h1>
                            <p className="text-gray-300">
                                Release date:{" "}
                                <span className="font-semibold">{data.released}</span>
                            </p>

                            {data.genres?.length > 0 && (
                                <div>
                                    <h2 className="text-xl font-semibold text-indigo-400 mb-1">
                                        Genres
                                    </h2>
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {data.genres.slice(0, 4).map((genre) => (
                                            <Link
                                                key={genre.id}
                                                to={`/games/${genre.slug}`}
                                                className="bg-indigo-600 px-3 py-1 rounded-full text-sm inline-block hover:bg-indigo-700 transition"
                                            >
                                                {genre.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {data.developers?.length > 0 && (
                                <p>
                                    <strong className="text-indigo-400">Developer:</strong>{" "}
                                    {data.developers.map((d) => d.name).join(", ")}
                                </p>
                            )}

                            {data.publishers?.length > 0 && (
                                <p>
                                    <strong className="text-indigo-400">Publisher:</strong>{" "}
                                    {data.publishers.map((p) => p.name).join(", ")}
                                </p>
                            )}

                            {data.esrb_rating && (
                                <p>
                                    <strong className="text-indigo-400">Age rating:</strong>{" "}
                                    {data.esrb_rating.name}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Descrizione + info secondarie */}
                    <div className="flex flex-col md:flex-row gap-10 mb-12">
                        <div className="md:w-2/3">
                            <h2 className="text-2xl font-semibold mb-4 text-indigo-400">
                                About
                            </h2>
                            {renderDescription()}
                        </div>

                        <div className="md:w-1/3 flex flex-col gap-8">
                            {data.platforms?.length > 0 && (
                                <div>
                                    <h2 className="text-2xl font-semibold text-indigo-400 mb-2">Platforms</h2>
                                    <ul className="list-disc list-inside text-gray-300 text-l max-h-55 overflow-auto">
                                        {data.platforms.map((p, i) => (
                                            <li key={i}>{p.platform.name}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {data.metacritic && (
                                <div>
                                    <h2 className="text-2xl font-semibold text-indigo-400 mb-1">
                                        Metascore
                                    </h2>
                                    <p className="text-2xl font-medium">{data.metacritic}</p>
                                </div>
                            )}

                            {data.parent_game && (
                                <div>
                                    <h2 className="text-xl font-semibold text-indigo-400 mb-2">
                                        Parent game
                                    </h2>
                                    <Link
                                        to={`/games/${data.parent_game.slug}/${data.parent_game.id}`}
                                        className="flex items-center gap-4 hover:underline"
                                    >
                                        <img
                                            src={data.parent_game.background_image}
                                            alt={data.parent_game.name}
                                            className="w-16 h-10 object-cover rounded"
                                        />
                                        <span>{data.parent_game.name}</span>
                                    </Link>
                                </div>
                            )}

                            {data.series_games?.length > 0 && (
                                <div>
                                    <h2 className="text-xl font-semibold text-indigo-400 mb-2">
                                        Other games in the series
                                    </h2>
                                    <div className="flex flex-wrap gap-4">
                                        {data.series_games.map((game) => (
                                            <Link
                                                key={game.id}
                                                to={`/games/${game.slug}/${game.id}`}
                                                className="flex flex-col items-center text-center w-20 hover:underline"
                                            >
                                                <img
                                                    src={game.background_image}
                                                    alt={game.name}
                                                    className="w-20 h-12 object-cover rounded"
                                                />
                                                <small className="text-gray-400 mt-1 truncate">
                                                    {game.name}
                                                </small>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Tags */}
                    {data.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-3 border-t border-indigo-600 pt-6">
                            {data.tags.map((tag) => (
                                <Link
                                    key={tag.id}
                                    to={`/tags/${tag.slug}`}
                                    className="bg-indigo-600 px-4 py-2 rounded-full text-sm hover:bg-indigo-700 transition"
                                    title={`Vai alla pagina del tag ${tag.name}`}
                                >
                                    {tag.name}
                                </Link>
                            ))}
                        </div>
                    )}
                </section>
            )}
        </>
    );
}
