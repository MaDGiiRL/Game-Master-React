import { useState } from "react";
import { useNavigate } from "react-router";

export default function Searchbar() {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [ariaInvalid, setAriaInvalid] = useState(null);

    const handleSearch = (event) => {
        event.preventDefault();
        if (typeof search === "string" && search.trim().length !== 0) {
            navigate(`/search?query=${search}`);
            setSearch("");
            setAriaInvalid(false);
        } else {
            setAriaInvalid(true);
        }
    };

    return (
        <form onSubmit={handleSearch} className="w-full">
            <fieldset
                role="group"
                className="grid grid-cols-[1fr_auto] gap-2 items-center"
            >
                <input
                    type="text"
                    name="search"
                    placeholder={
                        ariaInvalid
                            ? "Devi cercare qualcosa"
                            : "Search a game"
                    }
                    onChange={(event) => setSearch(event.target.value)}
                    value={search}
                    aria-invalid={ariaInvalid}
                    className={`w-full px-4 py-2 rounded-xl text-white bg-gray-800 border ${ariaInvalid
                            ? "border-red-500"
                            : "border-gray-700"
                        } focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400 transition`}
                />
                <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition whitespace-nowrap"
                >
                    Vai
                </button>
            </fieldset>
        </form>
    );
}
