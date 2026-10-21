import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'dummy_api_key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'kharcha-paani.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'kharcha-paani',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'kharcha-paani.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:123456789:web:abcdef',
};

// Check if actual configuration has been provided
export const isFirebaseConfigured = Boolean(
  import.meta.env.VITE_FIREBASE_API_KEY && 
  import.meta.env.VITE_FIREBASE_PROJECT_ID
);

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
