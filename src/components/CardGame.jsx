import LazyLoadGameImage from "./LazyLoadGameImage";

export default function CardGame({ game }) {
    const { name, background_image, released, genres, rating } = game;

    return (
        <article className="relative h-[300px] flex flex-col justify-between rounded-xl overflow-hidden shadow-xl transition-transform transform hover:scale-[1.02] bg-gray-900 group">

            {/* Immagine */}
            <div className="relative">
                <LazyLoadGameImage image={background_image} />

                {/* Overlay */}
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4">
                    <h2 className="text-white text-lg font-bold truncate">{name}</h2>
                    <p className="text-gray-300 text-sm">{released}</p>
                </div>
            </div>

            {/* Corpo card */}
            <div className="flex flex-col justify-between h-full p-4 space-y-2">
                <div className="flex flex-wrap gap-2">
                    {genres && genres.map((genre) => (
                        <span
                            key={genre.id}
                            className="text-xs bg-indigo-600 text-white px-2 py-1 rounded-full"
                        >
                            {genre.name}
                        </span>
                    ))}
                </div>

                <p className="text-sm text-gray-400">
                    ⭐ Rating: <span className="text-white font-medium">{rating || 'N/A'}</span>
                </p>

                <div className="flex justify-end mt-auto">
                    <a
                        href="#"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-400 hover:text-indigo-200 text-sm font-medium"
                    >
                        ➤ Scopri di più
                    </a>
                </div>
            </div>
        </article>
    );
}
