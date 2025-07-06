import { Routes, Route } from "react-router"
import Home from "./pages/Home";
import GenrePage from "./pages/GenrePage";
import PlatformPage from "./pages/PlatformPage";
import TopRatedPage from "./pages/TopRatedPage";
import OrderPage from "./pages/OrderPage";
import Layout from "../src/layout/Layout";
import GamePage from "./pages/GamePage";
import TagPage from "./pages/TagPage";
import SearchPage from "./pages/SearchPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import SessionProvider from "./context/SessionProvider";
import AccountPage from "./pages/AccountPage";


function App() {
  return (
    <SessionProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/games/:genre" element={<GenrePage />} />
          <Route path="/platforms/:platform" element={<PlatformPage />} />
          <Route path="/top-rated/:genre" element={<TopRatedPage />} />
          <Route path="/order/:sort" element={<OrderPage />} />
          <Route path="/games/:slug/:id" element={<GamePage />} />
          <Route path="/tags/:tag" element={<TagPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/account" element={<AccountPage />} />
        </Route>
      </Routes>
    </SessionProvider>
  )
}

export default App;

