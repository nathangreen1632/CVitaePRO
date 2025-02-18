import { createContext } from "react";

// ✅ Export the authentication type separately
export interface AuthContextType {
  user: string | null;
  token: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// ✅ Export `AuthContext` separately
export const AuthContext = createContext<AuthContextType | undefined>(undefined);
