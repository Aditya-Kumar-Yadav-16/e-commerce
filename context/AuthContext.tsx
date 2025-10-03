'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, User, onAuthStateChanged, signInAnonymously, signOut as firebaseSignOut } from 'firebase/auth';

// --- IMPORTANT: Replace with your actual Firebase Config ---
const firebaseConfig = {
  apiKey: "YOUR_API_KEY", 
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

// --- Type Definitions ---
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signInAnonymously: () => Promise<void>;
  signOutUser: () => Promise<void>;
}

// --- Firebase Initialization (Runs once outside the component) ---
let app: FirebaseApp;
let auth: ReturnType<typeof getAuth> | null = null; 
let isInitialized = false;

try {
    if (!isInitialized) {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        isInitialized = true;
    }
} catch (error) {
    console.warn("Firebase initialization failed. Check firebaseConfig.", error);
    auth = null; 
}

// --- Auth Provider Component ---
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define the interface for props
interface AuthProviderProps {
    children: ReactNode;
}

// **--- THE RESOLUTION IS HERE: Use React.FC and destructure props correctly ---**
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Public function to sign in
  const signInAnonymously = async () => {
    if (!auth) return;
    try {
        setIsLoading(true);
        await signInAnonymously();
    } catch (error) {
        console.error("Anonymous sign-in failed:", error);
    } 
  };

  // Public function to sign out
  const signOutUser = async () => {
    if (!auth) return;
    try {
        await firebaseSignOut(auth);
        console.log("User signed out.");
    } catch (error) {
        console.error("Sign-out failed:", error);
    }
  };

  // Effect to handle user state changes and initial sign-in
  useEffect(() => {
    if (!auth) {
        setIsLoading(false);
        return;
    }
    
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setIsLoading(false);
    });
    
    if (!user && !isLoading) {
        signInAnonymously();
    }

    return () => unsubscribe();
  }, [auth]); 
  
  const contextValue: AuthContextType = {
    user,
    isLoading,
    signInAnonymously,
    signOutUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth status
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};