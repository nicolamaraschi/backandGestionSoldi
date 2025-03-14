// Modifica completa per src/contexts/AuthContext.jsx
// Rimuoviamo la chiamata a api.cancelAllRequests

import React, { createContext, useState, useEffect, useContext } from 'react';
import { login as loginService, register as registerService, logout as logoutService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // Se c'è un token, consideriamo l'utente autenticato
          setUser({ isAuthenticated: true });
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
    
    // Rimuovi la chiamata a cancelAllRequests nel cleanup
    return () => {
      // Nessuna operazione di pulizia necessaria qui
    };
  }, []);

  const loginUser = async (credentials) => {
    setLoading(true);
    try {
      await loginService(credentials);
      setUser({ isAuthenticated: true });
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async (userData) => {
    setLoading(true);
    try {
      await registerService(userData);
      setUser({ isAuthenticated: true });
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = async () => {
    setLoading(true);
    try {
      await logoutService();
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    login: loginUser,
    register: registerUser,
    logout: logoutUser,
    isAuthenticated: user?.isAuthenticated || false,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};