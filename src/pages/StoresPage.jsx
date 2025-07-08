import { useEffect } from "react";
import useFetchSolution from "../hook/useFetchSolution";
import CardStore from "../components/CardStore";

export default function StoresPage() {
    const apiKey = "9269195f491e44539d7a2d10ce87ab15";

    const {
        data,
        error,
        loading,
        updateUrl,
    } = useFetchSolution(`https://api.rawg.io/api/stores?key=${apiKey}`);

    useEffect(() => {
        updateUrl(`https://api.rawg.io/api/stores?key=${apiKey}`);
    }, [updateUrl]);

    return (
        <>
            <h1 className="text-5xl font-bold mb-10 cursor-pointer mt-10 text-center uppercase" style={{ marginTop: 50, marginBottom: 70 }}>
                🛒 All Stores 🛒
            </h1>

            {loading && <p className="text-center text-white">Loading...</p>}
            {error && <article className="text-red-500 text-center">{error}</article>}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
                {data &&
                    data.results.map((store) => (
                        <CardStore key={store.id} store={store} />
                    ))}
            </div>
        </>
    );
}
