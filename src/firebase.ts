// firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// ✅ Paste your config here
const firebaseConfig = {
  apiKey: "AIzaSyA3_IwtovDo5feKRkWpzXrLod8xjqe1SzU",
  authDomain: "caption-ai-6683f.firebaseapp.com",
  projectId: "caption-ai-6683f",
  storageBucket: "caption-ai-6683f.appspot.com", // 👈 fix typo here
  messagingSenderId: "666623090512",
  appId: "1:666623090512:web:d44c3eefebbcb815cad655",
  measurementId: "G-LGS784KPCC"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Export services you'll use
export const auth = getAuth(app);
export const db = getFirestore(app);
export { app };

