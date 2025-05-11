import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { Industry } from '@/types';
import AuthService from '@/services/auth-service';

interface UserData {
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
 industry: Industry | null;
 firstName?: string | null;
  lastName?: string;
  company?: string;
  role?: string;
  phoneNumber?: string;
  emailVerified?: boolean;
}

interface ProfileUpdateData {
  firstName?: string;
  lastName?: string;
  company?: string;
  role?: string;
  phoneNumber?: string;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  updateIndustry: (industry: Industry) => Promise<void>;
  updateUserProfile: (profileData: ProfileUpdateData) => Promise<void>;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signInWithGoogle: async () => {},
  signOut: async () => {},
  sendPasswordReset: async () => {},
  updateIndustry: async () => {},
  updateUserProfile: async () => {},
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        try {
          const userDataFromFirestore = await AuthService.getCurrentUserData(user);
          setUserData({
            ...(userDataFromFirestore as UserData),
 firstName: (userDataFromFirestore as UserData)?.firstName || null,
 lastName: (userDataFromFirestore as UserData)?.lastName || null,
            emailVerified: user.emailVerified
          });
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Auth methods
  const signIn = async (email: string, password: string) => {
    await AuthService.signIn(email, password);
  };

  const signUp = async (email: string, password: string, name: string) => {
    await AuthService.signUp(email, password, name);
  };

  const signInWithGoogle = async () => {
    await AuthService.signInWithGoogle();
  };

  const signOut = async () => {
    await AuthService.signOut();
  };

  const sendPasswordReset = async (email: string) => {
    await AuthService.sendPasswordReset(email);
  };

  const updateIndustry = async (industry: Industry) => {
    if (user) {
      await AuthService.updateIndustry(user, industry);
      setUserData(prev => prev ? { ...prev, industry } : null);
    }
  };

  const updateUserProfile = async (profileData: ProfileUpdateData) => {
    if (user) {
      await AuthService.updateUserProfile(user.uid, profileData);
      
      // Update local state to reflect changes
      setUserData(prev => {
        if (!prev) return null;
        
        // Construct display name from first and last name
        const firstName = profileData.firstName || prev.firstName || '';
        const lastName = profileData.lastName || prev.lastName || '';
        const displayName = `${firstName} ${lastName}`.trim() || prev.displayName;
        
        return {
          ...prev,
          ...profileData,
          displayName
        };
      });
    }
  };

  const value = {
    user,
    userData,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    sendPasswordReset,
    updateIndustry,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};