import { createContext } from "react";
import type { User } from "firebase/auth";

export type AuthContextValue = {
  currentUser: User | null;
  userLoggedIn: boolean;
  loading: boolean;
  signOutUser: () => Promise<void>;
};

// Provide a default value to avoid undefined
export const AuthContext = createContext<AuthContextValue>({
  currentUser: null,
  userLoggedIn: false,
  loading: true,
  signOutUser: async () => {}
});