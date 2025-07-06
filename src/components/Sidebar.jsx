import { useState } from "react";
import GenresDropdown from "./GenresDropdown";
import Searchbar from "./Searchbar";

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);

    // Funzione per aprire/chiudere sidebar
    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>

            <button
                onClick={toggleSidebar}
                className="fixed top-4 left-4 z-50 p-2 rounded-md bg-indigo-600 text-white sm:hidden"
                aria-label={isOpen ? "Chiudi menu" : "Apri menu"}
            >
                {isOpen ? "✕" : "☰"}
            </button>


            <aside
                className={`
          fixed top-0 left-0 h-full bg-gray-900 text-white p-6 rounded-r-xl shadow-xl
          w-64
          transform transition-transform duration-300 ease-in-out
          sm:relative sm:translate-x-0
          ${isOpen
                        ? "translate-x-0"
                        : "-translate-x-full"
                    }
        `}
            >
                <GenresDropdown />
                <Searchbar />
            </aside>


            {isOpen && (
                <div
                    onClick={toggleSidebar}
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 sm:hidden"
                    aria-hidden="true"
                ></div>
            )}
        </>
    );
}
