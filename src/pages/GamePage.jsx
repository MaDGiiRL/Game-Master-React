import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import useFetchSolution from "../hook/useFetchSolution";
import ToggleFavorite from "../components/ToggleFavorite";
import ChatBox from "../components/ChatBox";
import SessionContext from "../context/SessionContext";

export default function GamePage() {
    const { id } = useParams();
    const { session } = useContext(SessionContext);
    const [screenshots, setScreenshots] = useState([]);
    const [stores, setStores] = useState([]);
    const [showAllTags, setShowAllTags] = useState(false);

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

    useEffect(() => {
        // 🔄 Aggiorna il gioco principale
        updateUrl(
            `https://api.rawg.io/api/games/${id}?key=9269195f491e44539d7a2d10ce87ab15`
        );

        // 🖼️ Fetch degli screenshot
        const fetchScreenshots = async () => {
            try {
                const response = await fetch(
                    `https://api.rawg.io/api/games/${id}/screenshots?key=9269195f491e44539d7a2d10ce87ab15`
                );
                if (!response.ok) throw new Error("Errore nella richiesta degli screenshot");
                const json = await response.json();
                setScreenshots(json.results || []);
            } catch (error) {
                console.error("❌ Errore nel fetch degli screenshot:", error.message);
            }
        };

        // 🛒 Fetch degli store
        const fetchStores = async () => {
            try {
                const response = await fetch(
                    `https://api.rawg.io/api/games/${id}/stores?key=9269195f491e44539d7a2d10ce87ab15`
                );
                if (!response.ok) throw new Error("Errore nella richiesta degli store");
                const json = await response.json();

                // Ordina per nome se disponibile
                const sortedStores = (json.results || []).sort((a, b) => {
                    if (!a.store?.name || !b.store?.name) return 0;
                    return a.store.name.localeCompare(b.store.name);
                });

                setStores(sortedStores);
            } catch (error) {
                console.error("❌ Errore nel fetch degli store:", error.message);
            }
        };

        fetchScreenshots();
        fetchStores();
    }, [id, updateUrl]);


    const renderDescription = () => {
        if (!data?.description_raw) return null;
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
                            <div className="flex items-center gap-4">
                                <h1 className="text-4xl font-bold mb-2 text-indigo-400">
                                    {data.name}
                                </h1>
                                <ToggleFavorite data={data} />
                            </div>

                            <p className="text-gray-300">
                                Release date:{" "}
                                <span className="font-semibold">{data.released}</span>
                            </p>

                            {data.genres?.length > 0 && (
                                <div>
                                    <h2 className="text-xl font-semibold text-indigo-400 mb-1">
                                        Generi
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
                    {/* Screenshot Gallery */}
                    {screenshots.length > 0 && (
                        <div className="mb-16">
                            <h2 className="text-2xl font-semibold text-indigo-400 mb-4">
                                Screenshots
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                {screenshots.map((shot, index) => (
                                    <div
                                        key={index}
                                        className="w-full h-38 overflow-hidden rounded-xl shadow-md"
                                    >
                                        <img
                                            src={shot.image}
                                            alt={`Screenshot ${index + 1}`}
                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

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
                                    <h2 className="text-2xl font-semibold text-indigo-400 mb-2">
                                        Platforms
                                    </h2>
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
                        <div className="flex flex-col gap-3 border-t border-indigo-600 border-b py-6">
                            <div className="flex flex-wrap gap-3">
                                {(showAllTags ? data.tags : data.tags.slice(0, 15)).map((tag) => (
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

                            {/* Pulsante toggle */}
                            {data.tags.length > 10 && (
                                <button
                                    onClick={() => setShowAllTags((prev) => !prev)}
                                    className="self-start mt-2 text-indigo-400 hover:text-indigo-200 text-sm transition"
                                >
                                    {showAllTags ? "Mostra meno" : "Mostra tutti"}
                                </button>
                            )}
                        </div>
                    )}

                    {/* Purchase Links - posizionata sopra la chat box */}
                    {stores.length > 0 && (
                        <section className="my-6 p-4 bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-700 rounded-lg shadow-lg">
                            <h2 className="text-3xl font-bold text-indigo-200 mb-4 border-b border-indigo-400 pb-2">
                                Shop This Game!
                            </h2>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {stores.map((store) => (
                                    <li
                                        key={store.id}
                                        className="bg-indigo-700 bg-opacity-60 rounded-md shadow-md hover:bg-indigo-600 transition-colors duration-300"
                                    >
                                        <a
                                            href={store.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 p-4 text-indigo-100 hover:text-white"
                                        >
                                            {/* Icona shopping cart semplice SVG */}
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-6 w-6 text-indigo-300 group-hover:text-white transition-colors"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth={2}
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 7M7 13l-2 5m5 0a2 2 0 11-4 0m14-5l-1.5 4.5m0 0a2 2 0 11-4 0m5-5H7"
                                                />
                                            </svg>

                                            {/* Nome store con testo grande e chiaro */}
                                            <span className="font-semibold text-lg truncate">
                                                {store.url}
                                            </span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {/* ChatBox o messaggio per registrarsi */}
                    {session ? (
                        <ChatBox data={data} />
                    ) : (
                        <div className="text-center mt-10 p-6 bg-gray-800 rounded-lg text-indigo-400">
                            <p>
                                Per chattare in live su questo gioco, <strong>registrati</strong> o effettua il login.
                            </p>
                            <div className="mt-3 flex justify-center gap-4">
                                <Link
                                    to="/register"
                                    className="text-white px-5 py-2 bg-indigo-600 hover:bg-indigo-500 rounded transition font-semibold"
                                >
                                    Registrati
                                </Link>
                                <Link
                                    to="/login"
                                    className="text-indigo-600 px-5 py-2 bg-white hover:bg-gray-200 rounded transition font-semibold"
                                >
                                    Login
                                </Link>
                            </div>
                        </div>
                    )}
                </section>
            )}
        </>

    );
}
