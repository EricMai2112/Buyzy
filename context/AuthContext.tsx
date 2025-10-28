import React, { createContext, useState, useContext, ReactNode } from "react";

interface AuthContextType {
  userId: string | null;
  userName: string | null;
  userRole: "user" | "admin" | null;
  login: (id: string, name: string, role: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<"user" | "admin" | null>(null);

  const login = (id: string, name: string, role: string) => {
    setUserId(id);
    setUserName(name);
    setUserRole(role === "admin" ? "admin" : "user");
  };

  const logout = () => {
    setUserId(null);
    setUserName(null);
  };

  return (
    <AuthContext.Provider value={{ userId, userName, userRole, login, logout }}>
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
