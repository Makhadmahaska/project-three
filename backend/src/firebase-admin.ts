import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

function getPrivateKey(): string {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error("FIREBASE_PRIVATE_KEY is missing");
  }
  return privateKey.replace(/\\n/g, "\n");
}

function getFirebaseConfig(): { projectId: string; clientEmail: string; privateKey: string } {
  const projectId = process.env.FIREBASE_CLIENT_PROJECT_ID ?? process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = getPrivateKey();

  if (!projectId) throw new Error("FIREBASE_CLIENT_PROJECT_ID or FIREBASE_PROJECT_ID is missing");
  if (!clientEmail) throw new Error("FIREBASE_CLIENT_EMAIL is missing");

  return { projectId, clientEmail, privateKey };
}

const firebaseAdminApp =
  getApps()[0] ??
  initializeApp({
    credential: cert(getFirebaseConfig())
  });

export const firebaseAdminAuth = getAuth(firebaseAdminApp);
