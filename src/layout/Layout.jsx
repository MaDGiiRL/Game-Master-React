import { Outlet } from 'react-router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './Layout.css';


export default function Layout() {
    return (
        <div className="layout-container bg-gradient-to-r from-gray-900 to-gray-800">
            <Header />
            <div className="layout-main">
                <Outlet />
            </div>
            <Footer />
        </div>
    );
}