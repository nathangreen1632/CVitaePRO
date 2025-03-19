import { createContext, useState, ReactNode, useMemo } from "react";

export interface AuthContextType {
  user: string | null;
  token: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const register = async (username: string, password: string): Promise<boolean> => {
    try {
      console.log("🔍 Sending registration request:", { username, password });

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({})); // Handle JSON parsing failure
        console.error("❌ Registration failed:", errorData?.error || "Unknown error");
        return false;
      }

      return true;
    } catch (error) {
      console.error("❌ Unexpected registration error:", error instanceof Error ? error.message : error);
      return false;
    }
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      console.log("🔍 Sending login request:", { username, password });

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json().catch(() => ({})); // Handle JSON parsing failure

      if (!response.ok) {
        console.error("❌ Login failed:", data?.error || "Unknown error");
        return false;
      }

      setUser(username);
      setToken(data.token);
      localStorage.setItem("token", data.token);

      return true;
    } catch (error) {
      console.error("❌ Unexpected login error:", error instanceof Error ? error.message : error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  const authContextValue = useMemo(
    () => ({ user, token, register, login, logout }),
    [user, token]
  );

  return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
};
