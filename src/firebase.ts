// src/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAFq8ERgRNbhY4gZJ1Npno7O5SckBEhMn0",
  authDomain: "caption-ai-4dcd1.firebaseapp.com",
  projectId: "caption-ai-4dcd1",
  storageBucket: "caption-ai-4dcd1.appspot.com", // ✅ Fixed typo (double dot)
  messagingSenderId: "728801178678",
  appId: "1:728801178678:web:be09420f4996fada9bd497",
  measurementId: "G-LGS784KPCC"
};

// ✅ Initialize Firebase app
const app = initializeApp(firebaseConfig);

// ✅ Export auth and firestore
export const auth = getAuth(app);
export const db = getFirestore(app);

// ✅ Export Google provider for login
export const googleProvider = new GoogleAuthProvider();

// ✅ Export the app (optional but useful)
export { app };
