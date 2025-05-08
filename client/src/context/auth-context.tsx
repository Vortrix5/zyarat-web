import { jwtDecode } from 'jwt-decode';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  user: {
    id: string;
    role: string;
    name: string;
    email: string;
    exp?: number; // exp is optional as it's part of JWT standard payload
  } | null;
  isAuthenticated: boolean;
  login: (token: string, userData: { id: string; role: string; name: string; email: string }) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define a type for the decoded JWT payload
interface DecodedToken {
  id: string;
  role: string;
  name: string;
  email: string;
  exp: number;
  // Add other properties from your JWT payload if necessary
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<{ id: string; role: string; name: string; email: string; exp?: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        // Check if token is expired
        const currentTime = Date.now() / 1000;
        if (decoded.exp && decoded.exp < currentTime) {
          localStorage.removeItem('jwt_token');
          setUser(null);
        } else {
          setUser({
            id: decoded.id,
            role: decoded.role,
            name: decoded.name,
            email: decoded.email,
            exp: decoded.exp
          });
        }
      } catch (error) {
        localStorage.removeItem('jwt_token');
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const login = (token: string, userData: { id: string; role: string; name: string; email: string }) => {
    localStorage.setItem('jwt_token', token);
    // Assuming the token itself contains exp, we can decode it here if needed
    // or expect it to be handled by the useEffect on next load.
    // For simplicity, we'll just set the user data provided.
    // If 'exp' needs to be immediately available on login, decode token here too.
    const decodedForExp = jwtDecode<DecodedToken>(token);
    setUser({ ...userData, exp: decodedForExp.exp });
  };

  const logout = () => {
    localStorage.removeItem('jwt_token');
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};