import { Routes, Route } from "react-router"
import Home from "./pages/Home";
import GenrePage from "./pages/GenrePage";
import Layout from "../src/layout/Layout";
import GamePage from "./pages/GamePage";
import TagPage from "./pages/TagPage";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/games/:genre" element={<GenrePage />} />
        <Route path="/games/:slug/:id" element={<GamePage />} />
        <Route path="/tags/:tag" element={<TagPage />} />
      </Route>
    </Routes>
  )
}

export default App;

