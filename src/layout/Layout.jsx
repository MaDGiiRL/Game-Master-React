import { Outlet } from 'react-router';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';

export default function Layout() {
    return (
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 min-h-screen text-white">
            <aside
                className="fixed left-0 w-full md:w-64 bg-gray-900 shadow-lg"
                style={{ zIndex: 9999 }}
            >
                <Sidebar />
            </aside>
            <div className="pt-1 md:pl-64 min-h-screen flex flex-col md:ml-6">
                <main className="flex-grow px-6 pb-16 overflow-y-auto"  style={{marginTop: 50}}>
                    <Outlet />
                </main>
                <Footer />
            </div>
        </div>
    );
}
