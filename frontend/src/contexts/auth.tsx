import {
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";

import {
  onAuthStateChanged,
  signOut,
  type User
} from "firebase/auth";

import { auth } from "../firebase/firebase";
import { AuthContext, type AuthContextValue } from "./auth-context";

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      currentUser,
      userLoggedIn: currentUser !== null,
      loading,
      signOutUser: () => signOut(auth)
    }),
    [currentUser, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}