import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { DEMO_MATCHMAKERS, type DemoMatchmaker } from "./demo-credentials";

interface AuthContextValue {
  matchmaker: DemoMatchmaker | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => { success: boolean; error?: string };
  quickLogin: (matchmakerId: string) => boolean;
  logout: () => void;
}

const STORAGE_KEY = "tdc_demo_session_matchmaker_id";

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [matchmaker, setMatchmaker] = useState<DemoMatchmaker | null>(() => {
    try {
      const storedId = localStorage.getItem(STORAGE_KEY);
      if (storedId) {
        const found = DEMO_MATCHMAKERS.find((mm) => mm.id === storedId);
        if (found) return found;
      }
    } catch {
      // Ignore localStorage access failures
    }
    return null;
  });

  const login = (username: string, password: string): { success: boolean; error?: string } => {
    const trimmedUser = username.trim().toLowerCase();
    const target = DEMO_MATCHMAKERS.find(
      (mm) => mm.username.toLowerCase() === trimmedUser && mm.password === password
    );

    if (!target) {
      return {
        success: false,
        error: "Invalid username or password. Please verify the demo credentials below."
      };
    }

    setMatchmaker(target);
    try {
      localStorage.setItem(STORAGE_KEY, target.id);
    } catch {
      // Ignore localStorage write failures
    }
    return { success: true };
  };

  const quickLogin = (matchmakerId: string): boolean => {
    const target = DEMO_MATCHMAKERS.find((mm) => mm.id === matchmakerId);
    if (!target) return false;

    setMatchmaker(target);
    try {
      localStorage.setItem(STORAGE_KEY, target.id);
    } catch {
      // Ignore localStorage write failures
    }
    return true;
  };

  const logout = () => {
    setMatchmaker(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore localStorage write failures
    }
  };

  return (
    <AuthContext.Provider
      value={{
        matchmaker,
        isAuthenticated: matchmaker !== null,
        login,
        quickLogin,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
