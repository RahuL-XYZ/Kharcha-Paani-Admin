import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../../lib/firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [claims, setClaims] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      // In dev mode when Firebase env vars are not set yet, don't hang indefinitely
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      if (currentUser) {
        try {
          // Force refresh token to get latest custom claims
          const idTokenResult = await currentUser.getIdTokenResult(true);
          const hasAdminClaim = Boolean(idTokenResult.claims?.admin);

          setUser(currentUser);
          setClaims(idTokenResult.claims);
          setIsAdmin(hasAdminClaim);
        } catch (error) {
          console.error('Error fetching admin claims:', error);
          setUser(currentUser);
          setIsAdmin(false);
        }
      } else {
        setUser(null);
        setClaims(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    setAuthError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idTokenResult = await userCredential.user.getIdTokenResult(true);
      const hasAdminClaim = Boolean(idTokenResult.claims?.admin);

      setUser(userCredential.user);
      setClaims(idTokenResult.claims);
      setIsAdmin(hasAdminClaim);

      return { user: userCredential.user, isAdmin: hasAdminClaim };
    } catch (error) {
      setAuthError(error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setIsAdmin(false);
      setClaims(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const value = {
    user,
    isAdmin,
    claims,
    loading,
    authError,
    login,
    logout,
    isFirebaseConfigured,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
