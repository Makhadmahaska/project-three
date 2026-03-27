import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA6RaEWZs5A7XB4ZR_QJfEG20O2WrPvJK8",
  authDomain: "project-three-99cba.firebaseapp.com",
  projectId: "project-three-99cba",
  storageBucket: "project-three-99cba.firebasestorage.app",
  messagingSenderId: "828388746002",
  appId: "1:828388746002:web:1f1b2f1629ab8d5b8ac9cb",
  measurementId: "G-JTEZ7XFMMS"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
