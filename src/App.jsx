import { Routes, Route } from "react-router"
import Home from "./pages/Home";
import GenrePage from "./pages/GenrePage";
import Layout from "../src/layout/Layout";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/games/:genre" element={<GenrePage />} />
        {/* <Route path="/games/:slug/:id" element={<GamePage />} /> */}
      </Route>
    </Routes>
  )
}

export default App;

