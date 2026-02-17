import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface AuthState {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
}

interface AuthContextValue extends AuthState {
  signUp: (email: string, password: string, meta?: { full_name?: string; phone?: string }) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    session: null,
    loading: true,
  });

  const fetchProfile = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    return data;
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!state.user) return;
    const profile = await fetchProfile(state.user.id);
    setState(prev => ({ ...prev, profile }));
  }, [state.user, fetchProfile]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchProfile(session.user.id).then(profile => {
          setState({ user: session.user, session, profile, loading: false });
        });
      } else {
        setState({ user: null, session: null, profile: null, loading: false });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        fetchProfile(session.user.id).then(profile => {
          setState({ user: session.user, session, profile, loading: false });
        });
      } else {
        setState({ user: null, session: null, profile: null, loading: false });
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  const signUp = async (email: string, password: string, meta?: { full_name?: string; phone?: string }) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: meta },
    });
    if (error) return { error: error.message };
    return { error: null };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ ...state, signUp, signIn, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
