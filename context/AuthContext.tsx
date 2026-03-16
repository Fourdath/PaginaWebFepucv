import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "../services/supabaseClient";

export type Role =
  | "editor"
  | "admin_mesa"
  | "admin_fepucv"
  | "admin_consejeria_superior";

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  role: Role | null;
  loading: boolean;
  signInWithPassword: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshRole: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function fetchUserRole(userId: string): Promise<Role | null> {
  // Opción A (recomendada): role guardado en tabla profiles
  // Tabla: profiles (id uuid PK = auth.users.id, role text)
  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  if (error) return null;
  return (data?.role as Role) ?? null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshRole = async () => {
    if (!user?.id) {
      setRole(null);
      return;
    }
    const r = await fetchUserRole(user.id);
    setRole(r);
  };

  useEffect(() => {
    let ignore = false;

    const init = async () => {
      setLoading(true);
      const { data } = await supabase.auth.getSession();
      if (ignore) return;

      setSession(data.session);
      setUser(data.session?.user ?? null);

      if (data.session?.user?.id) {
        const r = await fetchUserRole(data.session.user.id);
        if (!ignore) setRole(r);
      } else {
        setRole(null);
      }

      setLoading(false);
    };

    init();

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);

      if (newSession?.user?.id) {
        const r = await fetchUserRole(newSession.user.id);
        setRole(r);
      } else {
        setRole(null);
      }
    });

    return () => {
      ignore = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signInWithPassword = async (email: string, password: string) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) throw error;
  };

  const signOut = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    setLoading(false);
    if (error) throw error;
  };

  const value = useMemo(
    () => ({ user, session, role, loading, signInWithPassword, signOut, refreshRole }),
    [user, session, role, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
