import "./App.css";
import Portfolio from "./components/portfolio/portfolio";
import ScrollToTop from "./components/dashboard/ScrollToTop";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./components/auth/auth";
import Home from "./components/dashboard/Home";
import TradePage from "./components/trade/trade";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "./components/auth/authcontext";

function AppRoutes() {
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();


  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      axios
        .get("http://localhost:5000/balance", {
          withCredentials: true,
        })
        .then((res) => {
          setBalance(res.data.balance);
        })
        .catch((err) => {
          console.error("Error fetching balance:", err);
        });
    }, 5000);

    return () => clearInterval(interval); 
  }, [user]);

  return (
    <Routes>
      <Route
        path="/"
        element={user ? <Navigate to="/home" replace /> : <AuthPage />}
      />
      <Route
        path="/home"
        element={user ? <Home /> : <Navigate to="/" replace />}
      />
      <Route
        path="/trade"
        element={
          user ? (
            <TradePage balance={balance ?? 0} />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route
        path="/portfolio"
        element={
          user ? (
            <Portfolio balance={balance ?? 0} />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      <Route>path="/logout" element = {}</Route>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
