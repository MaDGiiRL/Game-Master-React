import { useState } from "react";
import GenresDropdown from "./GenresDropdown";
import SearchBar from './SearchBar';
export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen((prev) => !prev);
    };

    return (
        <>
            {/* Bottone filtri mobile */}
            <div className="md:hidden w-full mb-4 px-4" >
                <button
                    onClick={toggleSidebar}
                    className="bg-neutral-800 text-white px-4 py-3 rounded-xl w-full text-left flex justify-between items-center font-bold"
                    aria-expanded={isOpen}
                    aria-controls="sidebar"
                    aria-label="Toggle filtri"
                >
                    Filtri
                    <span
                        className={`inline-block transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"
                            }`}
                    >
                        ▼
                    </span>
                </button>
            </div>

            {/* Sidebar */}
            <aside
                id="sidebar"
                className={`
          fixed top-0 left-0 h-full bg-gray-900 text-white p-6 rounded-r-xl shadow-xl
          w-64
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:relative md:translate-x-0 md:rounded-none md:shadow-none
          z-50
        `}
            >
                <GenresDropdown />
                <SearchBar />
            </aside>

            {/* Overlay cliccabile solo su mobile quando sidebar aperta */}
            {isOpen && (
                <div
                    onClick={toggleSidebar}
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    aria-hidden="true"
                />
            )}
        </>
    );
}
