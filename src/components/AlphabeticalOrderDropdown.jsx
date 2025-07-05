export default function AlphabeticalOrderDropdown({ onSelect }) {
    const options = [
        { value: "name", label: "A → Z" },
        { value: "-name", label: "Z → A" },
    ];

    return (
        <details className="dropdown mb-4">
            <summary className="text-xl font-bold text-indigo-400 mb-2">🕹️ Ordine Alfabetico</summary>
            <ul className="bg-gray-800 text-white mt-2 rounded shadow-lg p-2">
                {options.map((opt) => (
                    <li
                        key={opt.value}
                        onClick={() => onSelect && onSelect(opt.value)}
                        className="py-1 px-2 hover:bg-indigo-600 rounded cursor-pointer"
                    >
                        {opt.label}
                    </li>
                ))}
            </ul>
        </details>
    );
}
