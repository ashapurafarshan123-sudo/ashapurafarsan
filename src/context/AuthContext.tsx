import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { UserProfile } from '../types';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isAdmin: boolean;
  isLoading: boolean;
  isConfigured: boolean;
  signUp: (data: { name: string; email: string; password: string; phone: string }) => Promise<{ error: string | null }>;
  signIn: (data: { email: string; password: string }) => Promise<{ error: string | null; isAdmin?: boolean }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: string | null }>;
  updateProfile: (data: { full_name: string; phone: string }) => Promise<{ error: string | null }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const configured = isSupabaseConfigured();

  // Helper to fetch user profile and check admin role
  const fetchUserData = useCallback(async (currentUser: User) => {
    if (!configured) {
      setIsAdmin(false);
      return;
    }

    try {
      // 1. Fetch Profile
      const { data: profileData, error: profileErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .maybeSingle();

      if (profileErr) {
        console.warn('Error fetching profile:', profileErr.message);
      }

      if (profileData) {
        setProfile(profileData as UserProfile);
      } else {
        // Fallback: create basic profile row if missing
        const fallbackName = currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || '';
        const fallbackPhone = currentUser.user_metadata?.phone || '';
        const { data: newProfile } = await supabase
          .from('profiles')
          .insert({
            id: currentUser.id,
            full_name: fallbackName,
            phone: fallbackPhone,
          })
          .select()
          .maybeSingle();

        if (newProfile) {
          setProfile(newProfile as UserProfile);
        }
      }

      // 2. Check Admin Role via secure RPC or admin_roles table
      try {
        const { data: rpcAdmin, error: rpcErr } = await supabase.rpc('is_admin', {
          check_user_id: currentUser.id,
        });

        if (!rpcErr && typeof rpcAdmin === 'boolean') {
          setIsAdmin(rpcAdmin);
        } else {
          // Fallback direct check against admin_roles table protected by RLS
          const { data: roleData } = await supabase
            .from('admin_roles')
            .select('role')
            .eq('user_id', currentUser.id)
            .maybeSingle();

          setIsAdmin(Boolean(roleData));
        }
      } catch (err) {
        console.warn('Admin check error:', err);
        setIsAdmin(false);
      }
    } catch (err) {
      console.error('fetchUserData unexpected error:', err);
    }
  }, [configured]);

  // Initial session hydration
  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      if (!configured) {
        if (isMounted) setIsLoading(false);
        return;
      }

      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        if (isMounted) {
          setSession(initialSession);
          setUser(initialSession?.user ?? null);
        }

        if (initialSession?.user) {
          await fetchUserData(initialSession.user);
        }
      } catch (err) {
        console.error('Session initialization error:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initAuth();

    // Listen to Auth State Changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        if (!isMounted) return;

        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
          if (currentSession?.user) {
            await fetchUserData(currentSession.user);
          }
        } else if (event === 'SIGNED_OUT') {
          setProfile(null);
          setIsAdmin(false);
        }

        setIsLoading(false);
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [configured, fetchUserData]);

  // Sign Up
  const signUp = async ({ name, email, password, phone }: { name: string; email: string; password: string; phone: string }) => {
    if (!configured) {
      return { error: 'Supabase is not configured. Please add your credentials in .env.' };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            full_name: name.trim(),
            phone: phone.trim(),
          },
          emailRedirectTo: `${window.location.origin}/login`,
        },
      });

      if (error) return { error: error.message };

      if (data.user) {
        // Safe profile initialization
        await supabase.from('profiles').upsert({
          id: data.user.id,
          full_name: name.trim(),
          phone: phone.trim(),
        });
      }

      return { error: null };
    } catch (err: unknown) {
      return { error: (err as AuthError)?.message || 'An unexpected error occurred during registration.' };
    }
  };

  // Sign In
  const signIn = async ({ email, password }: { email: string; password: string }) => {
    if (!configured) {
      return { error: 'Supabase is not configured. Please add your credentials in .env.' };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) return { error: error.message };

      let userIsAdmin = false;
      if (data.user) {
        // Direct admin check to return immediately for router navigation
        const { data: rpcAdmin } = await supabase.rpc('is_admin', {
          check_user_id: data.user.id,
        });
        userIsAdmin = Boolean(rpcAdmin);
        setIsAdmin(userIsAdmin);
        await fetchUserData(data.user);
      }

      return { error: null, isAdmin: userIsAdmin };
    } catch (err: unknown) {
      return { error: (err as AuthError)?.message || 'Invalid login credentials.' };
    }
  };

  // Sign Out
  const signOut = async () => {
    if (configured) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Sign out error:', err);
      }
    }
    setUser(null);
    setSession(null);
    setProfile(null);
    setIsAdmin(false);
  };

  // Request Password Reset Link
  const resetPassword = async (email: string) => {
    if (!configured) {
      return { error: 'Supabase is not configured.' };
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) return { error: error.message };
      return { error: null };
    } catch (err: unknown) {
      return { error: (err as AuthError)?.message || 'Could not send reset password email.' };
    }
  };

  // Save New Password (From Reset Password Link)
  const updatePassword = async (newPassword: string) => {
    if (!configured) {
      return { error: 'Supabase is not configured.' };
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) return { error: error.message };
      return { error: null };
    } catch (err: unknown) {
      return { error: (err as AuthError)?.message || 'Failed to update password.' };
    }
  };

  // Update Profile Info
  const updateProfile = async ({ full_name, phone }: { full_name: string; phone: string }) => {
    if (!user) return { error: 'Not authenticated' };

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: full_name.trim(),
          phone: phone.trim(),
        })
        .eq('id', user.id);

      if (error) return { error: error.message };

      setProfile((prev) => (prev ? { ...prev, full_name: full_name.trim(), phone: phone.trim() } : null));
      return { error: null };
    } catch (err: unknown) {
      return { error: (err as Error)?.message || 'Could not update profile.' };
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchUserData(user);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        isAdmin,
        isLoading,
        isConfigured: configured,
        signUp,
        signIn,
        signOut,
        resetPassword,
        updatePassword,
        updateProfile,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
