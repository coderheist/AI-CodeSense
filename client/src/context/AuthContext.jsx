import { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  OAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../utils/firebase';
import { registerUser } from '../utils/api';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if Firebase auth is available
    if (!auth) {
      console.error('❌ Firebase auth not initialized - check environment variables');
      setError('Firebase configuration missing. Some features may not work.');
      setLoading(false);
      return;
    }

    // Set a timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      if (loading) {
        console.warn('Auth initialization timeout - continuing anyway');
        setLoading(false);
      }
    }, 5000); // 5 seconds max wait

    let unsubscribe;
    try {
      unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          // Register/update user in backend
          try {
            await registerUser({
              firebaseUid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
            });
            setUser(firebaseUser);
          } catch (error) {
            console.error('Error registering user:', error);
            // Don't block on backend errors
          }
        } else {
          setUser(null);
        }
        setLoading(false);
        clearTimeout(timeout);
      });
    } catch (error) {
      console.error('Firebase auth initialization error:', error);
      setError(error.message);
      setLoading(false);
      clearTimeout(timeout);
    }

    return () => {
      clearTimeout(timeout);
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  };

  const loginWithGithub = async () => {
    const provider = new GithubAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (error) {
      console.error('GitHub login error:', error);
      throw error;
    }
  };

  const loginWithLinkedIn = async () => {
    const provider = new OAuthProvider('oidc.linkedin');
    provider.addScope('openid');
    provider.addScope('profile');
    provider.addScope('email');
    try {
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (error) {
      console.error('LinkedIn login error:', error);
      throw error;
    }
  };

  const loginWithEmail = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (error) {
      console.error('Email login error:', error);
      throw error;
    }
  };

  const signupWithEmail = async (email, password) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (error) {
      console.error('Email signup error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    error,
    loginWithGoogle,
    loginWithGithub,
    loginWithLinkedIn,
    loginWithEmail,
    signupWithEmail,
    logout,
  };

  // Always render children, even while loading
  // Show a loading indicator if needed, but don't block the entire app
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
