// /Users/makhadmahaska/Downloads/project-three-main 4/backend/src/firebase-config.ts
export function getFirebaseProjectId(): string {
  const projectId =
    process.env.FIREBASE_CLIENT_PROJECT_ID ??
    process.env.FIREBASE_PROJECT_ID ??
    "project-three-99cba";

  return projectId;
}
