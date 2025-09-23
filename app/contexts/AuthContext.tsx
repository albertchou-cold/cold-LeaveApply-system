'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SessionUser } from '@/app/types/auth';

interface AuthContextType {
  user: SessionUser | null;
  login: (user: SessionUser, token: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 檢查本地存儲的 token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // 驗證 token 並獲取用戶信息
      fetchUserInfo(token);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUserInfo = async (token: string) => {
    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData.user);
      } else {
        // Token 無效，清除本地存儲
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Failed to fetch user info:', error);
      localStorage.removeItem('token');
    } finally {
      setIsLoading(false);
    }
  };

  const login = (userData: SessionUser, token: string) => {
    setUser(userData);
    localStorage.setItem('token', token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
