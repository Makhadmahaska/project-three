// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA6RaEWZs5A7XB4ZR_QJfEG20O2WrPvJK8",
  authDomain: "project-three-99cba.firebaseapp.com",
  projectId: "project-three-99cba",
  storageBucket: "project-three-99cba.firebasestorage.app",
  messagingSenderId: "828388746002",
  appId: "1:828388746002:web:1f1b2f1629ab8d5b8ac9cb",
  measurementId: "G-JTEZ7XFMMS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAnalytics(app);

export { app, auth}