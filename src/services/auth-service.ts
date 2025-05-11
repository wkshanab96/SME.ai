import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  User,
  UserCredential
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Industry } from '@/types';

interface ProfileUpdateData {
  firstName?: string;
  lastName?: string;
  company?: string;
  role?: string;
  phoneNumber?: string;
}

// Main Authentication Service
export const AuthService = {
  // Sign up with email and password
  async signUp(email: string, password: string, displayName: string): Promise<UserCredential> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update user profile with display name
      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName
        });
        
        // Send email verification
        await sendEmailVerification(userCredential.user);
        
        try {
          // Create user document in Firestore
          await setDoc(doc(db, 'users', userCredential.user.uid), {
            email,
            displayName,
            photoURL: null,
            industry: null,
            createdAt: serverTimestamp(),
            lastLogin: serverTimestamp()
          });
        } catch (firestoreError) {
          console.error('Failed to create user document:', firestoreError);
          // Continue with authentication even if Firestore write fails
          // The user can still use the app, and we can try to create their document later
        }
      }
      
      return userCredential;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  },
  
  // Sign in with email and password
  async signIn(email: string, password: string): Promise<UserCredential> {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Update last login timestamp
    if (userCredential.user) {
      try {
        await setDoc(
          doc(db, 'users', userCredential.user.uid),
          {
            lastLogin: serverTimestamp()
          },
          { merge: true }
        );
      } catch (error) {
        console.error('Failed to update last login:', error);
        // Continue even if update fails
      }
    }
    
    return userCredential;
  },
  
  // Sign in with Google
  async signInWithGoogle(): Promise<UserCredential> {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      
      try {
        // Check if the user already exists in Firestore
        const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
        
        if (!userDoc.exists()) {
          // Create new user document for Google auth users
          await setDoc(doc(db, 'users', userCredential.user.uid), {
            email: userCredential.user.email,
            displayName: userCredential.user.displayName,
            photoURL: userCredential.user.photoURL,
            industry: null,
            createdAt: serverTimestamp(),
            lastLogin: serverTimestamp()
          });
        } else {
          // Update last login timestamp
          await setDoc(
            doc(db, 'users', userCredential.user.uid),
            {
              lastLogin: serverTimestamp()
            },
            { merge: true }
          );
        }
      } catch (firestoreError) {
        console.error('Failed to create/update user document:', firestoreError);
        // Continue with authentication even if Firestore operations fail
      }
      
      return userCredential;
    } catch (error) {
      console.error('Google sign-in error:', error);
      throw error;
    }
  },
  
  // Sign out the current user
  async signOut(): Promise<void> {
    await firebaseSignOut(auth);
  },
  
  // Send password reset email
  async sendPasswordReset(email: string): Promise<void> {
    await sendPasswordResetEmail(auth, email);
  },
  
  // Update user industry selection
  async updateIndustry(user: User, industry: Industry): Promise<void> {
    await setDoc(
      doc(db, 'users', user.uid),
      {
        industry
      },
      { merge: true }
    );
  },
  
  // Update user profile information
  async updateUserProfile(userId: string, profileData: ProfileUpdateData): Promise<void> {
    try {
      // Update user document in Firestore with the new profile data
      await setDoc(
        doc(db, 'users', userId),
        {
          ...profileData,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
      
      // If the user has both first and last name, update their display name in Firebase Auth
      if (profileData.firstName || profileData.lastName) {
        const userData = await this.getCurrentUserData(auth.currentUser as User);
        
        // Get existing data to combine with new data
        const firstName = profileData.firstName || userData?.firstName || '';
        const lastName = profileData.lastName || userData?.lastName || '';
        const displayName = `${firstName} ${lastName}`.trim();
        
        // Only update if we have a valid display name and the user is logged in
        if (displayName && auth.currentUser) {
          await updateProfile(auth.currentUser, {
            displayName
          });
        }
      }
    } catch (error) {
      console.error('Failed to update user profile:', error);
      throw error;
    }
  },
  
  // Get current user data from Firestore
  async getCurrentUserData(user: User) {
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (userDoc.exists()) {
      return userDoc.data();
    }
    return null;
  },
  
  // Get the current authenticated user
  getCurrentUser(): User | null {
    return auth.currentUser;
  }
};

export default AuthService;