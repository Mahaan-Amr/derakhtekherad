'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'TEACHER' | 'STUDENT';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  success: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role?: 'ADMIN' | 'TEACHER' | 'STUDENT') => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  clearError: () => void;
  clearSuccess: () => void;
  refreshToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Check if token is expired
  const checkTokenExpiration = (tokenStr: string | null): boolean => {
    if (!tokenStr) return true;
    
    try {
      const tokenParts = tokenStr.split('.');
      if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1]));
        if (payload.exp) {
          const now = Math.floor(Date.now() / 1000);
          const timeLeft = payload.exp - now;
          console.log(`Token expires in ${timeLeft} seconds (${timeLeft / 60} minutes)`);
          return timeLeft <= 0;
        }
      }
    } catch (error) {
      console.error('Error checking token expiration:', error);
    }
    
    return true; // Default to expired if we can't verify
  };

  // Refresh token function
  const refreshToken = async (): Promise<boolean> => {
    if (!user) {
      console.log('No user found, cannot refresh token');
      return false;
    }

    try {
      console.log('Attempting to refresh token for user:', user.email);
      
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: user.id,
          email: user.email,
          role: user.role
        }),
      });

      if (!response.ok) {
        console.error('Token refresh failed:', response.status);
        return false;
      }

      const data = await response.json();
      
      if (data.token) {
        console.log('Token refreshed successfully, new token length:', data.token.length);
        setToken(data.token);
        localStorage.setItem('token', data.token);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error refreshing token:', error);
      return false;
    }
  };

  // Auto-refresh token if expired on initialization
  useEffect(() => {
    const autoRefreshIfNeeded = async () => {
      if (token && user) {
        const isExpired = checkTokenExpiration(token);
        if (isExpired) {
          console.log('Token is expired on initialization, attempting refresh');
          await refreshToken();
        }
      }
    };
    
    autoRefreshIfNeeded();
  }, [token, user]);

  // Load user data from localStorage on initial render
  useEffect(() => {
    const loadUserFromStorage = () => {
      try {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        
        console.log('Auth context initialization');
        
        if (storedUser && storedToken) {
          console.log('Found stored token with length:', storedToken.length);
          
          // Check token expiration
          const isExpired = checkTokenExpiration(storedToken);
          console.log('Token is expired:', isExpired);
          
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
        } else {
          console.log('No user or token found in storage');
        }
      } catch (err) {
        console.error('Failed to load user from storage:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserFromStorage();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    console.log('Login attempt for email:', email);
    
    try {
      console.log('Sending login request to /api/auth/login');
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Make sure to include cookies
      });

      console.log('Login response status:', response.status);
      const data = await response.json();
      console.log('Login response data:', JSON.stringify(data, null, 2));

      if (!response.ok) {
        console.error('Login failed with status:', response.status);
        throw new Error(data.error || 'Login failed');
      }

      console.log('Login successful, setting user and token');
      
      // Verify we got proper data
      if (!data.user || !data.token) {
        console.error('Login response missing user or token data:', data);
        throw new Error('Login response is missing required data');
      }
      
      setUser(data.user);
      setToken(data.token);
      
      console.log('Saving user and token to localStorage');
      
      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
      
      console.log('Login process completed successfully');
      return true;
    } catch (err) {
      console.error('Login process error:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: 'ADMIN' | 'TEACHER' | 'STUDENT' = 'STUDENT') => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // After registration, automatically log in
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Registration error:', err);
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Password reset request failed');
      }

      setSuccess(data.message || 'Password reset instructions have been sent to your email.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Password reset request error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (token: string, password: string) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Password reset failed');
      }

      setSuccess(data.message || 'Your password has been reset successfully. You can now log in with your new password.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Password reset error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const clearError = () => {
    setError(null);
  };

  const clearSuccess = () => {
    setSuccess(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        error,
        success,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
        clearError,
        clearSuccess,
        refreshToken
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider; 