import { BrowserRouter, Routes, Route } from "react-router";
import Home from "../pages/Home";
import Layout from "../layout/Layout";
import GenrePage from "../pages/GenrePage";

export function Routing() {
    <BrowserRouter>
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/games/:genre" element={<GenrePage />} />
                {/* <Route path="/games/:slug/:id" element={<GamePage />} /> */}
            </Route>
        </Routes>
    </BrowserRouter>
}

