import { useEffect, useState } from "react";
import { useParams } from "react-router";
import CardGame from "../components/CardGame";
import useFetchSolution from "../hook/useFetchSolution";

const API_KEY = "7e2a905b584040ff9809f7bbd5dd7ed4";

export default function PlatformPage() {
    const { platform } = useParams(); 


    const [platformDetails, setPlatformDetails] = useState(null);
    const [loadingPlatform, setLoadingPlatform] = useState(true);
    const [errorPlatform, setErrorPlatform] = useState(null);

    const {
        data,
        error,
        loading,
        updateUrl,
    } = useFetchSolution(
        `https://api.rawg.io/api/games?key=${API_KEY}&platforms=${platform}&page=1`
    );

  
    useEffect(() => {
        async function fetchPlatformDetails() {
            setLoadingPlatform(true);
            setErrorPlatform(null);
            try {
                const res = await fetch(`https://api.rawg.io/api/platforms/${platform}?key=${API_KEY}`);
                if (!res.ok) throw new Error("Errore nel recupero dati piattaforma");
                const json = await res.json();
                setPlatformDetails(json);
            } catch (e) {
                setErrorPlatform(e.message);
            } finally {
                setLoadingPlatform(false);
            }
        }
        fetchPlatformDetails();
    }, [platform]);

    useEffect(() => {
        updateUrl(
            `https://api.rawg.io/api/games?key=${API_KEY}&platforms=${platform}&page=1`
        );
    }, [platform, updateUrl]);

    return (
        <>
            <h1 className="text-4xl font-bold text-center text-green-400 my-10 uppercase" style={{ marginTop: 50, marginBottom: 70 }}>
                💻 Giochi su{" "}
                {loadingPlatform
                    ? "Caricamento..."
                    : errorPlatform
                        ? "Errore nel caricamento piattaforma"
                        : platformDetails?.name || platform}
            </h1>

            {(loading || loadingPlatform) && <p className="text-white text-center">Loading...</p>}
            {(error || errorPlatform) && (
                <p className="text-red-500 text-center">{error || errorPlatform}</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 px-4">
                {data?.results.map((game) => (
                    <CardGame key={game.id} game={game} />
                ))}
            </div>
        </>
    );
}
