// src/firebase.ts
import { initializeApp } from 'firebase/app';
import { initializeAuth, browserLocalPersistence, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// ✅ Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAFq8ERgRNbhY4gZJ1Npno7O5SckBEhMn0",
  authDomain: "caption-ai-4dcd1.firebaseapp.com",
  projectId: "caption-ai-4dcd1",
  storageBucket: "caption-ai-4dcd1.appspot.com",
  messagingSenderId: "728801178678",
  appId: "1:728801178678:web:be09420f4996fada9bd497",
  measurementId: "G-LGS784KPCC"
};

// ✅ Initialize Firebase app
const app = initializeApp(firebaseConfig);

// ✅ Firestore
export const db = getFirestore(app);

// ✅ Auth with only local persistence (no IndexedDB)
export const auth = initializeAuth(app, {
  persistence: browserLocalPersistence
});

// ✅ Google provider
export const googleProvider = new GoogleAuthProvider();

// ✅ Export the app (optional)
export { app };
