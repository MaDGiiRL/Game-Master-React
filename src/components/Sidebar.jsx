import { useState } from "react";
import GenresDropdown from "./GenresDropdown";
import Searchbar from "./Searchbar";

export default function Sidebar() {

    return (
        <aside className="w-full sm:w-64 bg-gray-900 text-white p-6 rounded-xl space-y-6">
            <GenresDropdown />
            <Searchbar />
        </aside >
    );
}
