import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStoredTokens, setStoredTokens, clearStoredTokens } from '../utils/storage';
import { refreshToken as apiRefreshToken } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = getStoredTokens();
    return stored ? stored.user : null;
  });
  const [accessToken, setAccessToken] = useState(() => {
    const stored = getStoredTokens();
    return stored ? stored.accessToken : null;
  });
  const [refreshToken, setRefreshToken] = useState(() => {
    const stored = getStoredTokens();
    return stored ? stored.refreshToken : null;
  });
  const navigate = useNavigate();

  useEffect(() => {
    const stored = getStoredTokens();
    if (stored) {
      setAccessToken(stored.accessToken);
      setRefreshToken(stored.refreshToken);
      setUser(stored.user);
    }
  }, []);

  useEffect(() => {
    if (accessToken && refreshToken && user) {
      setStoredTokens({ accessToken, refreshToken, user });
    }
  }, [accessToken, refreshToken, user]);

  const logout = () => {
    clearStoredTokens();
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    navigate('/');
  };

  const refresh = async () => {
    if (!refreshToken) {
      logout();
      return null;
    }
    const data = await apiRefreshToken(refreshToken);
    setAccessToken(data.access);
    if (data.refresh) {
      setRefreshToken(data.refresh);
    }
    return data.access;
  };

  const value = useMemo(
    () => ({
      user,
      accessToken,
      refreshToken,
      setUser,
      setAccessToken,
      setRefreshToken,
      logout,
      refresh
    }),
    [user, accessToken, refreshToken]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}

