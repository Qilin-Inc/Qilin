// src/lib/auth-context.tsx

import { createContext, useContext, useState, useEffect } from "react";
import { Admin } from "@/types";
import { mockSuperAdmin, mockStaffAdmins } from "@/mock/data";

interface AuthContextType {
  user: Admin | null;
  login: (email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Admin | null>(null);

  const login = (email: string) => {
    if (email === mockSuperAdmin.email) {
      setUser(mockSuperAdmin);
    } else {
      const staffAdmin = mockStaffAdmins.find((admin) => admin.email === email);
      if (staffAdmin) setUser(staffAdmin);
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
