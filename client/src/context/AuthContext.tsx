import { createContext, useState, useMemo, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

export interface AuthContextType {
  user: string | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: { firstName: string; lastName: string; email: string; password: string }) => Promise<{ success: boolean; token?: string }>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (storedToken) {
        setToken(storedToken);
      }

      if (storedUser) {
        setUser(storedUser);
      }
    }
  }, []);


  const register = async ({
                            firstName,
                            lastName,
                            email,
                            password
                          }: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): Promise<{ success: boolean; token?: string }> => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.token) {
        console.error("Registration failed:", data?.error ?? "Unknown error");
        return { success: false };
      }

      setUser(email);
      setToken(data.token);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", email);

      return { success: true, token: data.token };
    } catch (error) {
      console.error(
        "Unexpected registration error:",
        error instanceof Error ? error.message : error
      );
      return { success: false };
    }
  };



  const login = async (
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        console.error("Login failed:", data?.error ?? "Unknown error");
        return false;
      }

      setUser(email);
      setToken(data.token);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", email);

      return true;
    } catch (error) {
      console.error(
        "Unexpected login error:",
        error instanceof Error ? error.message : error
      );
      return false;
    }
  };

  const logout = (): void => {
    setUser(null);
    setToken(null);

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("intentionalLogout");

    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("logout"));
    }

    navigate('/login', { replace: true });
  };

  const authContextValue = useMemo(
    () => ({ user, token, register, login, logout }),
    [user, token]
  );

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
