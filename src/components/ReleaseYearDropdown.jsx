import { useState } from "react";

export default function ReleaseYearDropdown({ onSelect }) {
    const [selectedYear, setSelectedYear] = useState(null);

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 25 }, (_, i) => currentYear - i);

    const handleSelect = (year) => {
        setSelectedYear(year);
        onSelect && onSelect(year); // callback opzionale
    };

    return (
        <details className="dropdown mb-4">
            <summary className="text-xl font-bold text-indigo-400 mb-2">👾 Anno di Uscita</summary>
            <ul className="bg-gray-800 text-white mt-2 rounded shadow-lg max-h-60 overflow-y-auto p-2">
                {years.map((year) => (
                    <li
                        key={year}
                        onClick={() => handleSelect(year)}
                        className={`py-1 px-2 hover:bg-indigo-600 rounded cursor-pointer ${selectedYear === year ? "bg-indigo-700" : ""
                            }`}
                    >
                        {year}
                    </li>
                ))}
            </ul>
        </details>
    );
}
