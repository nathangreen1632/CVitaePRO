import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext.jsx";

export const AuthProvider = ({ children }: { children: React.ReactNode }): React.JSX.Element => {
  const [user, setUser] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      if (storedUser && storedToken) {
        setUser(storedUser);
        setToken(storedToken);
      }
    }
  }, []);


  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      localStorage.setItem("user", data.username);
      localStorage.setItem("token", data.token);
      setUser(data.username);
      setToken(data.token);

      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const register = async (username: string, password: string): Promise<{ success: boolean; token?: string }> => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        return { success: false };
      }

      const data = await response.json();
      return { success: true, token: data.token };
    } catch (error) {
      console.error("Registration failed:", error);
      return { success: false };
    }
  };

  const logout = (): void => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    sessionStorage.removeItem("intentionalLogout");  // Optional cleanup for your session logic

    setUser(null);
    setToken(null);

    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("logout"));
    }

    navigate("/login", { replace: true });
  };


  const value = useMemo(
    () => ({ user, token, login, register, logout }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
