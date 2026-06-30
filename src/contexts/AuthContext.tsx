import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCurrentUser,
  signOutUser,
  LocalUser,
  authenticateUser,
  registerUser,
} from "@/lib/localAuth";

interface AuthContextType {
  user: LocalUser | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
  signIn: async () => {},
  register: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<LocalUser | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const signOut = async () => {
    await signOutUser();
    setUser(null);
    navigate("/auth");
  };

  const signIn = async (email: string, password: string) => {
    const signedInUser = await authenticateUser(email, password);
    setUser(signedInUser);
  };

  const register = async (email: string, password: string, fullName?: string) => {
    const signedInUser = await registerUser(email, password, fullName);
    setUser(signedInUser);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut, signIn, register }}>
      {children}
    </AuthContext.Provider>
  );
};
