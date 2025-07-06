import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";

export default function GamePage() {
    const { id } = useParams();

    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    const initialUrl = `https://api.rawg.io/api/games/${id}?key=9269195f491e44539d7a2d10ce87ab15`;

    const load = async () => {
        try {
            const response = await fetch(initialUrl);
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            const json = await response.json();
            setData(json);
            setError(null);
        } catch (error) {
            setError(error.message);
            setData(null);
        }
    };

    useEffect(() => {
        load();
    }, [id]);

    return (
        <>
            {error && <h1 className="text-red-400 text-xl text-center mt-10">{error}</h1>}

            {data && (
                <section className="max-w-6xl mx-auto px-4 py-16 text-white" style={{ marginTop: 50 }}>
                    {/* Riga 1: Immagine + Info principali */}
                    <div className="flex flex-col md:flex-row gap-10 mb-12">
                        {/* Immagine */}
                        <div className="flex-shrink-0 w-full md:w-1/2 h-[400px] rounded-2xl overflow-hidden shadow-lg relative">
                            <img
                                src={data.background_image}
                                alt={data.name}
                                className="w-full h-full object-cover object-center opacity-90"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                        </div>

                        {/* Info principali (Genre, Release date, Developer, Publisher, Age rating) */}
                        <div className="flex flex-col justify-center gap-6 md:w-1/2">
                            {/* Nome + data release */}
                            <h1 className="text-4xl font-bold mb-2 text-indigo-400">{data.name}</h1>
                            <p className="text-gray-300">Release date: <span className="font-semibold">{data.released}</span></p>

                            {/* Genres */}
                            {data.genres?.length > 0 && (
                                <div>
                                    <h2 className="text-xl font-semibold text-indigo-400 mb-1">Genres</h2>
                                    <div className="flex flex-wrap gap-2">
                                        {data.genres.map((genre) => (
                                            <Link
                                                to={`/games/${genre.slug}`}
                                                className="bg-indigo-600 px-3 py-1 rounded-full text-sm inline-block hover:bg-indigo-700 transition"
                                                onClick={() => onSelectGenre?.(genre.name)}
                                            >
                                                {genre.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Developer */}
                            {data.developers?.length > 0 && (
                                <p>
                                    <strong className="text-indigo-400">Developer:</strong>{" "}
                                    {data.developers.map((d) => d.name).join(", ")}
                                </p>
                            )}

                            {/* Publisher */}
                            {data.publishers?.length > 0 && (
                                <p>
                                    <strong className="text-indigo-400">Publisher:</strong>{" "}
                                    {data.publishers.map((p) => p.name).join(", ")}
                                </p>
                            )}

                            {/* Age rating */}
                            {data.esrb_rating && (
                                <p>
                                    <strong className="text-indigo-400">Age rating:</strong> {data.esrb_rating.name}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Riga 2: Descrizione + Platforms, Metascore, Parent game, Other games */}
                    <div className="flex flex-col md:flex-row gap-10 mb-12">
                        {/* Descrizione */}
                        <div className="md:w-2/3">
                            <h2 className="text-2xl font-semibold mb-4 text-indigo-400">About</h2>
                            <p className="text-gray-300 leading-relaxed" style={{ fontSize: 15, textAlign: "justify" }}>{data.description_raw}</p>
                        </div>

                        {/* Colonna info secondarie */}
                        <div className="md:w-1/3 flex flex-col gap-8">
                            {/* Platforms */}
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

                            {/* Metascore */}
                            {data.metacritic && (
                                <div>
                                    <h2 className="text-2xl font-semibold text-indigo-400 mb-1">Metascore</h2>
                                    <p className="text-2xl font-medium">{data.metacritic}</p>
                                </div>
                            )}

                            {/* Parent game */}
                            {data.parent_game && (
                                <div>
                                    <h2 className="text-xl font-semibold text-indigo-400 mb-2">Parent game</h2>
                                    <a
                                        href={`/games/${data.parent_game.slug}/${data.parent_game.id}`}
                                        className="flex items-center gap-4 hover:underline"
                                    >
                                        <img
                                            src={data.parent_game.background_image}
                                            alt={data.parent_game.name}
                                            className="w-16 h-10 object-cover rounded"
                                        />
                                        <span>{data.parent_game.name}</span>
                                    </a>
                                </div>
                            )}

                            {/* Other games in the series */}
                            {data.series_games?.length > 0 && (
                                <div>
                                    <h2 className="text-xl font-semibold text-indigo-400 mb-2">Other games in the series</h2>
                                    <div className="flex flex-wrap gap-4">
                                        {data.series_games.map((game) => (
                                            <a
                                                key={game.id}
                                                href={`/games/${game.slug}/${game.id}`}
                                                className="flex flex-col items-center text-center w-20 hover:underline"
                                            >
                                                <img
                                                    src={game.background_image}
                                                    alt={game.name}
                                                    className="w-20 h-12 object-cover rounded"
                                                />
                                                <small className="text-gray-400 mt-1 truncate">{game.name}</small>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Riga 3: Tags full width */}
                    {data.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-3 border-t border-indigo-600 pt-6">
                            {data.tags.map((tag) => (
                                <Link
                                    key={tag.id}
                                    to={`/tags/${tag.slug || tag.id}`}
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
