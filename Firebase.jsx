// src/Firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database'; // For Realtime Database

const firebaseConfig = {
  apiKey: "AIzaSyCjWnJd0D0s-8Ov8hDGGODN84lu0tuKnew",
  authDomain: "codeninjas-36075.firebaseapp.com",
  projectId: "codeninjas-36075",
  storageBucket: "codeninjas-36075.firebasestorage.app",
  messagingSenderId: "836574327822",
  appId: "1:836574327822:web:653b1fa21bd8d04b72f85f",
  measurementId: "G-2HKPPFZE0H"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); // Firestore
export const rtdb = getDatabase(app); // Realtime Database (if you prefer this)
export default app;