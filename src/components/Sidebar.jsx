import { useState } from "react";
import GenresDropdown from "./GenresDropdown";

export default function Sidebar({ filters, setFilters }) {

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <aside className="w-full sm:w-64 bg-gray-900 text-white p-6 rounded-xl shadow-lg space-y-6">
        
            {/* Filtro per genere */}
            <GenresDropdown />
        </aside >
    );
}
