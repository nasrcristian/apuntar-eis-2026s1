import { createContext, useContext, useState, type ReactNode } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  token: string | null;
  login: (token: string, user: object) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("jwt"),
  );

  const isLoggedIn = !!token;

  const login = (newToken: string, user: Object) => {
    localStorage.setItem("jwt", newToken);
    localStorage.setItem("user", JSON.stringify(user));
    setToken(newToken);
  };

  const logout = () => {
    localStorage.clear();
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
}
