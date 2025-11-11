import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

export interface User {
  user_id: number;
  email: string;
  username?: string;
}

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check session on mount
    axios
      .get("http://localhost:5000/auth-status", { withCredentials: true })
      .then((res) => {
        if (res.data.logged_in) {
          setUser(res.data);
        }
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

    const logout = async () => {
    try {
      await axios.post("http://localhost:5000/logout", {}, { withCredentials: true });
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setUser(null); // clear user from React state
    }
  };


  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout  }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};