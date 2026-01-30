import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { useUserStore } from "../store/userStore";
import {
  loginService,
  logoutService,
  onAuthStateChange,
} from "../services/authService";
import { supabase } from "../services/supabaseClient";
import { AuthUser } from "../types/types";

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isSignedIn: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { setUser: setUserStore, clearUser } = useUserStore.getState();

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!mounted) return;
        if (data.session?.user) {
          // onAuthStateChange will enrich the user
        } else {
          setUser(null);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    })();

    const { data: subscription } = onAuthStateChange((nextUser) => {
      setUser(nextUser);
    });

    return () => {
      mounted = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (user) {
      setUserStore(user);
    } else {
      clearUser();
    }
  }, [user, setUserStore, clearUser]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const logged = await loginService(email, password);
      setUser(logged);
      await AsyncStorage.setItem("auth_user", JSON.stringify(logged));
      return logged;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await logoutService();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const value = useMemo(() => ({
    user,
    isLoading,
    isSignedIn: !!user,
    login,
    logout,
  }), [user, isLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
