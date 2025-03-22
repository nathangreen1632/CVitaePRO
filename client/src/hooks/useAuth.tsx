import { useContext } from "react";
import { AuthContext, AuthContextType } from "../context/AuthContext.jsx";

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
    return defaultAuth;
  }

  return context;
};
