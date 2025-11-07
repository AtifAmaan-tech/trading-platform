import "./App.css";
import Portfolio from "./components/portfolio/portfolio";
import ScrollToTop from "./components/ScrollToTop";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./components/auth"; // Import the new AuthPage
import { useState, useEffect } from "react";
import axios from "axios";
import Home from "./components/dashboard/Home";
import TradePage from "./trade/trade";

axios.defaults.withCredentials = true;

interface Props {
  onLoginStatusChange?: (value: boolean) => void;
}

function App({ onLoginStatusChange }: Props) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoggedIn(false);
      setLoading(false);
      return;
    }

    axios
      .get("http://localhost:5000/check-auth", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.authenticated) setLoggedIn(true);
      })
      .catch(() => setLoggedIn(false))
      .finally(() => setLoading(false));
  }, [onLoginStatusChange]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* <Route
          path="/"
          element={loggedIn ? <Navigate to="/home" /> : <AuthPage />}
        /> */}
        <Route
          path="/"
          element={
            loggedIn ? (
              <Navigate to="/home" replace />
            ) : (
              <AuthPage onLogin={() => setLoggedIn(true)} />
            )
          }
        />

        <Route
          path="/home"
          element={loggedIn ? <Home /> : <Navigate to="/" />}
        />
        <Route
          path="/trade"
          element={loggedIn ? <TradePage /> : <Navigate to="/trade" />}
        />
        <Route
          path="/portfolio"
          element={loggedIn ? <Portfolio /> : <Navigate to="/portfolio" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
