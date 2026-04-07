import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const env = import.meta.env;

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY ?? "AIzaSyA6RaEWZs5A7XB4ZR_QJfEG20O2WrPvJK8",
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN ?? "project-three-99cba.firebaseapp.com",
  projectId: env.VITE_FIREBASE_PROJECT_ID ?? "project-three-99cba",
  storageBucket:
    env.VITE_FIREBASE_STORAGE_BUCKET ?? "project-three-99cba.firebasestorage.app",
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? "828388746002",
  appId: env.VITE_FIREBASE_APP_ID ?? "1:828388746002:web:1f1b2f1629ab8d5b8ac9cb",
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID ?? "G-JTEZ7XFMMS"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
