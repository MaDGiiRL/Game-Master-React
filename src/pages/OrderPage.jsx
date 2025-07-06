import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import CardGame from "../components/CardGame";
import useFetchSolution from "../hook/useFetchSolution";

export default function OrderPage() {
    const { sort } = useParams();

    const getOrderingParam = () => {
        switch (sort) {
            case "asc":
                return "name";     // A → Z
            case "desc":
                return "-name";    // Z → A
            case "top":
                return "-rating";  // Più votati
            case "worst":
                return "rating";   // Meno votati
            default:
                return "name";
        }
    };

    const orderingParam = getOrderingParam();

    const {
        data,
        error,
        loading,
        updateUrl,
    } = useFetchSolution(
        `https://api.rawg.io/api/games?key=7e2a905b584040ff9809f7bbd5dd7ed4&ordering=${orderingParam}&page=1`
    );

    useEffect(() => {
        updateUrl(
            `https://api.rawg.io/api/games?key=7e2a905b584040ff9809f7bbd5dd7ed4&ordering=${orderingParam}&page=1`
        );
    }, [orderingParam, updateUrl]);

    return (
        <>
            <h1 className="text-4xl font-bold text-indigo-300 text-center my-10 uppercase" style={{ marginTop: 50, marginBottom: 70 }}>
                🎮 Ordinamento: <span className="text-white">{sort}</span>
            </h1>

            {/* 🔽 FILTRI DI ORDINAMENTO */}
            <div className="flex justify-center gap-4 flex-wrap mb-10">
                <Link
                    to="/order/asc"
                    className={`bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded ${sort === "asc" ? "bg-indigo-700" : ""
                        }`}
                >
                    🔤 A → Z
                </Link>
                <Link
                    to="/order/desc"
                    className={`bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded ${sort === "desc" ? "bg-indigo-700" : ""
                        }`}
                >
                    🔠 Z → A
                </Link>
                <Link
                    to="/order/top"
                    className={`bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded ${sort === "top" ? "bg-green-700" : ""
                        }`}
                >
                    ⭐ Più votati
                </Link>
                <Link
                    to="/order/worst"
                    className={`bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded ${sort === "worst" ? "bg-red-700" : ""
                        }`}
                >
                    🔻 Meno votati
                </Link>
            </div>

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
