import React, { createContext, useState, useContext, ReactNode } from "react";

interface AuthContextType {
  userId: string | null;
  userName: string | null;
  login: (id: string, name: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  const login = (id: string, name: string) => {
    setUserId(id);
    setUserName(name);
  };

  const logout = () => {
    setUserId(null);
    setUserName(null);
  };

  return (
    <AuthContext.Provider value={{ userId, userName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
