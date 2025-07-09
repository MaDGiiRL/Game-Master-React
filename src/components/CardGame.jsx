import { useContext } from "react";
import { Link } from 'react-router-dom';
import LazyLoadGameImage from "./LazyLoadGameImage";
import ToggleFavorite from "./ToggleFavorite";
import SessionContext from "../context/SessionContext";

export default function CardGame({ game }) {
    const { name, background_image, released, genres, rating } = game;
    const { session } = useContext(SessionContext); 

    return (
       <article className="relative h-[400px] flex flex-col justify-between rounded-xl overflow-hidden shadow-xl transition-transform transform hover:scale-[1.02] bg-gradient-to-b from-gray-900 to-gray-800 group">


            {/* Immagine con link */}
            <div className="relative">
                <Link to={`/games/${game.slug}/${game.id}`}>
                    <LazyLoadGameImage image={background_image} />

                    {/* Overlay titolo + data */}
                    <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4">
                        <h2 className="text-white text-lg font-bold truncate hover:underline">{name}</h2>
                        <p className="text-gray-300 text-sm">{released}</p>
                    </div>
                </Link>

                {/* Toggle cuore visibile solo se loggato */}
                {session && (
                    <div className="absolute top-2 right-2 z-10">
                        <ToggleFavorite data={game} />
                    </div>
                )}
            </div>

            {/* Corpo card */}
            <div className="flex flex-col justify-between h-full p-4 space-y-2">

                {/* Generi */}
                <div className="flex flex-wrap gap-2 pt-2">
                    {genres && genres.map((genre) => (
                        <Link
                            key={genre.id || `${genre.slug}-${genre.name}`}
                            to={`/games/${genre.slug}`}
                            className="bg-indigo-600 px-3 py-1 rounded-full text-xs inline-block hover:bg-indigo-700 transition"
                        >
                            {genre.name}
                        </Link>
                    ))}
                </div>

                {/* Rating */}
                <p className="text-xl text-gray-400 pt-5">
                    ⭐ Rating: <span className="text-white font-medium">{rating || 'N/A'}</span>
                </p>

                {/* Link Dettagli */}
                <div className="flex justify-end mt-auto pb-5">
                    <Link
                        to={`/games/${game.slug}/${game.id}`}
                        className="text-indigo-400 hover:text-indigo-200 text-xl font-medium"
                    >
                        ➤ Scopri di più
                    </Link>
                </div>
            </div>
        </article>
    );
}
