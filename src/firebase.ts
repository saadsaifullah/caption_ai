// firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyAFq8ERgRNbhY4gZJ1Npno7O5SckBEhMn0",
  authDomain: "caption-ai-4dcd1.firebaseapp.com",
  projectId: "caption-ai-4dcd1",
  storageBucket: "caption-ai-4dcd1..appspot.com",
  messagingSenderId: "728801178678",
  appId: "1:728801178678:web:be09420f4996fada9bd497",
  measurementId: "G-LGS784KPCC"
};
// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Export services you'll use
export const auth = getAuth(app);
export const db = getFirestore(app);
export { app };

