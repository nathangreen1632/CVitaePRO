import { useContext } from "react";
import { AuthContext, AuthContextType } from "../context/AuthContext.jsx";

// ✅ Create a fallback to prevent crashes
const defaultAuth: AuthContextType = {
  user: null,
  token: null,
  login: async () => false,
  register: async () => false,
  logout: () => {},
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    console.warn("⚠️ Warning: useAuth was called outside of AuthProvider. Using default values.");
    return defaultAuth; // ✅ Return safe fallback instead of crashing
  }

  return context;
};
