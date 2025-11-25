import "./App.css";
import Portfolio from "./components/portfolio/portfolio";
import ScrollToTop from "./components/dashboard/ScrollToTop";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./components/auth/auth";
import Home from "./components/dashboard/Home";
import TradePage from "./components/trade/trade";
import { useEffect, useState } from "react";
import axios from "axios";
import useCryptoPrice from "./components/hooks/useCryptoPrice";
import { useAuth } from "./components/auth/authcontext";

interface TokenResponse {
  quantity: string;
  token_symbol: string;
}

function AppRoutes() {
  const [balance, setBalance] = useState<number | null>(null);
  const { user } = useAuth();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [totalBalance, setTotalBalance] = useState<number>();
  const [assets, setAssets] = useState<TokenResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const { prices } = useCryptoPrice();

  const triggerRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const fetchAssets = async () => {
    if (!user) return "user not logged in";
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/get_tokens_qty", {
        withCredentials: true,
      });

      const tokens = Array.isArray(res.data?.result) ? res.data.result : [];
      setAssets(tokens);
    } catch (err) {
      console.error("Error fetching assets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, [balance]);

  useEffect(() => {
    if (!user) {
      console.log("User not registered");
      return;
    }

    const interval = setInterval(() => {
      axios
        .get("http://localhost:5000/total-balance", {
          withCredentials: true,
        })
        .then((res) => {
          const balances = res.data.balance; // array of [symbol, quantity]

          let total = 0;

          balances.forEach(([symbol, rawQty]: [string, string]) => {
            // Convert scientific notation like "0E-8" to number
            const quantity = Number(rawQty);

            // price from your hook (example: prices.BTC)
            const price = symbol === "USDT" ? 1 : prices[symbol];

            if (!price || quantity === 0) return;
            

            total += quantity * price;
          });
          setTotalBalance(Number(total.toFixed(2)));
        })
        .catch((err) => {
          console.error("Error fetching balance:", err);
        });
    }, 1000);

    return () => clearInterval(interval);
  }, [user, prices]);

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
    }, 1000);

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
            <TradePage
              balance={balance ?? 0}
              assets={assets}
              onTradeComplete={triggerRefresh}
              refresh={refreshTrigger}
            />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route
        path="/portfolio"
        element={
          user ? (
            <Portfolio totalBalance={totalBalance} assets={assets} />
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
