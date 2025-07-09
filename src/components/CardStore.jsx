import { Link } from "react-router-dom";

export default function CardStore({ store }) {
    const { id, name, domain, slug, games_count, image_background, description } = store;
    const officialUrl = domain ? `https://${domain}` : null;

    return (
        <Link
            to={`/stores/${slug}`}
            key={id}
            className="relative h-[320px]  flex flex-col justify-between rounded-xl overflow-hidden shadow-xl transition-transform transform hover:scale-[1.02] bg-gradient-to-b from-gray-900 to-gray-800 group"
            aria-label={`Vai alla pagina dello store ${name}`}
        >
            {/* Immagine */}
            <div className="relative">
                <img
                    src={image_background}
                    alt={name}
                    className="w-full h-48 object-cover"
                />

                {/* Overlay */}
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4">
                    <h2 className="text-white text-lg font-bold truncate group-hover:underline">{name}</h2>
                </div>
            </div>

            {/* Corpo card */}
            <div className="flex flex-col justify-between h-full p-4 space-y-2">
                {/* Giochi disponibili */}
                <p className="text-sm text-gray-400 pt-2">
                    🕹️ Giochi disponibili: <span className="text-white font-medium">{games_count}</span>
                </p>

                {/* Description */}
                {description && (
                    <p className="text-xs text-gray-300 line-clamp-3">{description}</p>
                )}

                {/* Link esterno allo store ufficiale */}
                <div className="flex justify-end mt-auto pt-3">
                    {officialUrl ? (
                        <a
                            href={officialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-400 hover:text-indigo-200 text-sm font-medium"
                            onClick={(e) => e.stopPropagation()} // ← previene click sul Link wrapper
                        >
                            ➤ Visita lo store ufficiale
                        </a>
                    ) : (
                        <span className="text-gray-500 text-sm italic">Store non disponibile</span>
                    )}
                </div>
            </div>
        </Link>
    );
}
