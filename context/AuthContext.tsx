import React, { createContext, useState, useContext, PropsWithChildren } from 'react';
import { User, Role } from '../types';

// Hardcoded credentials
const users: Record<string, { password: string, role: Role }> = {
  jefetaller: { password: 'jefetaller123', role: Role.JefeDeTaller },
  asesor: { password: 'asesor123', role: Role.Asesor },
  mecanico: { password: 'mecanico123', role: Role.Mecanico },
};

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// FIX: Used PropsWithChildren for better type inference of the children prop.
export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const storedUser = localStorage.getItem('serproauto_user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  const login = async (username: string, password: string): Promise<void> => {
    const foundUser = users[username.toLowerCase()];
    if (foundUser && foundUser.password === password) {
      const userToStore: User = { username, role: foundUser.role };
      localStorage.setItem('serproauto_user', JSON.stringify(userToStore));
      setUser(userToStore);
      return Promise.resolve();
    }
    return Promise.reject(new Error('Credenciales inválidas'));
  };

  const logout = () => {
    localStorage.removeItem('serproauto_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};