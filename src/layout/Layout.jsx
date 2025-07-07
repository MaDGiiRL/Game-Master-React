import { Outlet } from 'react-router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import './Layout.css';

export default function Layout() {
    return (
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 min-h-screen text-white">
            <header className="top-0 left-0 w-full  z-50">
                <Header />
            </header>
            <aside
                className="hidden md:block fixed left-0 w-64 bg-gray-900 shadow-lg"
                style={{ zIndex: 9999 }}
            >
                <Sidebar />
            </aside>
            <div className="pt-16 md:pl-64 min-h-screen flex flex-col">
                <main className="flex-grow px-6 pb-16 overflow-y-auto">
                    <Outlet />
                </main>
                <Footer />
            </div>
        </div>

    );
}
