import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { User } from '../types';

const resolveUrl = (path: string) => {
  const isCapacitor = window.location.origin.includes('capacitor://') || 
                      window.location.origin.includes('http://localhost') || 
                      window.location.origin.includes('https://localhost');
  
  if (isCapacitor && !window.location.port) {
    return `https://ais-dev-rcnccfz36oyfefv6r7lbqi-37017289110.europe-west1.run.app${path}`;
  }
  return path;
};

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string, phoneNumber: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loading: boolean;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(resolveUrl('/api/user/profile'));
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(resolveUrl('/api/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        setUser(data.user);
        setIsAuthenticated(true);
        return true;
      } else {
        setError(data.message || 'Login failed');
        return false;
      }
    } catch (err) {
      console.error('Login request failed:', err);
      setError('Network error or server unavailable');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string, phoneNumber: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(resolveUrl('/api/auth/register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, phoneNumber }),
      });
      const data = await response.json();
      if (response.ok) {
        setUser(data.user);
        setIsAuthenticated(true);
        return true;
      } else {
        setError(data.message || 'Registration failed');
        return false;
      }
    } catch (err) {
      console.error('Registration request failed:', err);
      setError('Network error or server unavailable');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(resolveUrl('/api/auth/logout'));
      if (response.ok) {
        setUser(null);
        setIsAuthenticated(false);
      } else {
        setError('Logout failed');
      }
    } catch (err) {
      console.error('Logout request failed:', err);
      setError('Network error or server unavailable');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout, loading, error, clearError }}>
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
