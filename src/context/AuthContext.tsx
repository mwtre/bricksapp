import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '../types';
import { mockUsers } from '../data/mockData';
import { googleAuthService, GoogleUser } from '../services/googleAuth';
import { userService } from '../services/database';
import { supabase, isSupabaseAvailable } from '../lib/supabase';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth on app load
    const storedUser = localStorage.getItem('bricksapp_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Check if Supabase is available
      if (isSupabaseAvailable() && supabase) {
        // Try Supabase authentication first
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (authError) {
          // Fallback to mock authentication
          await new Promise(resolve => setTimeout(resolve, 1000));
          const foundUser = mockUsers.find(u => u.email === email);
          if (foundUser && password === 'password123') {
            setUser(foundUser);
            localStorage.setItem('bricksapp_user', JSON.stringify(foundUser));
            setIsLoading(false);
            return true;
          }
          setIsLoading(false);
          return false;
        }

        // If Supabase auth successful, get user data
        if (authData.user) {
          let userData = await userService.getUserByEmail(email);
          
          if (!userData) {
            // Create user in database if doesn't exist
            userData = await userService.createUser({
              email: authData.user.email!,
              name: authData.user.user_metadata?.full_name || email.split('@')[0],
              role: 'bricklayer', // Default role
              isActive: true,
              createdAt: new Date().toISOString(),
              lastLogin: new Date().toISOString(),
              preferences: {
                language: 'en',
                theme: 'light',
                notifications: true
              }
            });
          }
          
          setUser(userData);
          localStorage.setItem('bricksapp_user', JSON.stringify(userData));
          setIsLoading(false);
          return true;
        }
      } else {
        // Supabase not available, use mock authentication
        console.log('Supabase not configured, using mock authentication');
        await new Promise(resolve => setTimeout(resolve, 1000));
        const foundUser = mockUsers.find(u => u.email === email);
        if (foundUser && password === 'password123') {
          setUser(foundUser);
          localStorage.setItem('bricksapp_user', JSON.stringify(foundUser));
          setIsLoading(false);
          return true;
        }
      }
      
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const googleLogin = async (): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // For demo purposes, use the demo method
      // In production, you would use: const googleUser = await googleAuthService.signIn();
      const googleUser = await googleAuthService.signInDemo();
      
      if (googleUser) {
        // Check if Supabase is available
        if (isSupabaseAvailable()) {
          // Try to find existing user
          let userData = await userService.getUserByEmail(googleUser.email);
          
          if (!userData) {
            // Create new user from Google data
            userData = await userService.createUser({
              email: googleUser.email,
              name: googleUser.name,
              role: 'bricklayer', // Default role for Google login
              avatar: googleUser.picture,
              isActive: true,
              createdAt: new Date().toISOString(),
              lastLogin: new Date().toISOString(),
              preferences: {
                language: 'en',
                theme: 'light',
                notifications: true
              }
            });
          } else {
            // Update last login
            userData = await userService.updateUser(userData.id, {
              lastLogin: new Date().toISOString()
            });
          }
          
          setUser(userData);
          localStorage.setItem('bricksapp_user', JSON.stringify(userData));
          setIsLoading(false);
          return true;
        } else {
          // Supabase not available, create user in localStorage
          console.log('Supabase not configured, creating user in localStorage');
          const userData: User = {
            id: googleUser.id,
            email: googleUser.email,
            name: googleUser.name,
            role: 'bricklayer',
            avatar: googleUser.picture,
            isActive: true,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            preferences: {
              language: 'en',
              theme: 'light',
              notifications: true
            }
          };
          
          setUser(userData);
          localStorage.setItem('bricksapp_user', JSON.stringify(userData));
          setIsLoading(false);
          return true;
        }
      }
      
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Google login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('bricksapp_user');
    googleAuthService.signOut();
    if (isSupabaseAvailable() && supabase) {
      supabase.auth.signOut();
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, googleLogin, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};