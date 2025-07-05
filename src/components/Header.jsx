import logo from '../public/logo.png';

export default function Header() {
    return (
        <header className="bg-gradient-to-r from-gray-900 to-gray-800 text-white fixed top-0 w-full z-50">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <div className="flex">
                    <img src={logo} alt="Logo" style={{ width: '50px' }} />
                    <h1 className="text-3xl font-bold tracking-tight text-white">
                        Game <span className="text-indigo-500">Master</span>
                    </h1>
                </div>

                <div className="flex space-x-4">
                    <a href="" className="bg-indigo-600 hover:bg-indigo-700 transition-colors text-sm font-medium px-5 py-2 rounded-xl shadow-lg">
                        Login
                    </a>
                    <a href="" className="bg-transparent border border-indigo-500 text-indigo-400 hover:bg-indigo-600 hover:text-white transition-colors text-sm font-medium px-5 py-2 rounded-xl shadow-lg">
                        Registrati
                    </a>
                </div>
            </div>
        </header>
    );
}