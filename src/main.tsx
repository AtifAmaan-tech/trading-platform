import { StrictMode,useEffect,useState } from "react";
import { Toaster } from "sonner";
import { AuthProvider } from "./components/auth/authcontext.tsx";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import LoadingScreen from "./components/LoadingScreen.tsx";

const RootApp: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Timeout is optional — just to prevent flash loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return isLoading ? <LoadingScreen /> : <App />;
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <RootApp />
      <Toaster position="top-right" />
    </AuthProvider>
  </StrictMode>
);
