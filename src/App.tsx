import "./App.css";
import Portfolio from "./components/portfolio/portfolio";
import ScrollToTop from "./components/dashboard/ScrollToTop";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./components/auth/auth";
import Home from "./components/dashboard/Home";
import TradePage from "./components/trade/trade";
import { useAuth } from "./components/auth/authcontext";

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

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
        element={user ? <TradePage /> : <Navigate to="/" replace />}
      />
      <Route
        path="/portfolio"
        element={user ? <Portfolio /> : <Navigate to="/" replace />}
      />
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