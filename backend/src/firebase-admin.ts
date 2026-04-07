import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

/**
 * Safely get the Firebase private key
 */
function getPrivateKey(): string {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error("FIREBASE_PRIVATE_KEY is missing");
  }
  // Replace escaped newlines with real newlines
  return privateKey.replace(/\\n/g, "\n");
}

/**
 * Safely get required Firebase environment variables
 */
function getFirebaseConfig(): { projectId: string; clientEmail: string; privateKey: string } {
  const projectId = process.env.FIREBASE_CLIENT_PROJECT_ID ?? process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = getPrivateKey();

  if (!projectId) throw new Error("FIREBASE_CLIENT_PROJECT_ID or FIREBASE_PROJECT_ID is missing");
  if (!clientEmail) throw new Error("FIREBASE_CLIENT_EMAIL is missing");

  return { projectId, clientEmail, privateKey };
}

// Initialize Firebase Admin app (reuses existing if already initialized)
const firebaseAdminApp =
  getApps()[0] ??
  initializeApp({
    credential: cert(getFirebaseConfig())
  });

// Export Auth instance
export const firebaseAdminAuth = getAuth(firebaseAdminApp);