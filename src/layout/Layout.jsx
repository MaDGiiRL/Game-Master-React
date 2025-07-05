import { Outlet } from 'react-router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import './Layout.css';

export default function Layout() {
    return (
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 min-h-screen text-white">
            <Header />
            <aside className="hidden md:block fixed top-16 left-0 w-64 h-[calc(100vh-4rem)] bg-gray-900 shadow-lg z-40">
                <Sidebar />
            </aside>
            <main className="md:pl-64 pt-6 px-6 pb-24  overflow-y-auto">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
