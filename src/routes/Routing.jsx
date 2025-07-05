import { BrowserRouter, Routes, Route } from 'react-router';
import Layout from '../layout/Layout';
import HomePage from '../pages/Home';

export default function Routing() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/" element={<HomePage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}