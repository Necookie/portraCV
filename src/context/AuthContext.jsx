import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);

  useEffect(() => {
    let mounted = true;

    // --- SAFETY VALVE: Force app to load after 2 seconds no matter what ---
    const safetyTimer = setTimeout(() => {
        if (mounted && loading) {
            console.warn("Auth check timed out. Forcing app to load.");
            setLoading(false);
        }
    }, 2000);

    async function initializeAuth() {
      try {
        const { data: { user: serverUser }, error } = await supabase.auth.getUser();
        
        if (mounted) {
          if (error || !serverUser) {
            console.log("No valid session found.");
            setUser(null);
            if (error) await supabase.auth.signOut(); 
          } else {
            console.log("User verified:", serverUser.email);
            setUser(serverUser);
          }
        }
      } catch (err) {
        console.error("Auth Crash:", err);
        if (mounted) setUser(null);
      } finally {
        if (mounted) {
            setLoading(false);
            clearTimeout(safetyTimer);
        }
      }
    }

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsRecoveryMode(true);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsRecoveryMode(false);
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setUser(session?.user ?? null);
      }
    });

    return () => {
      mounted = false;
      clearTimeout(safetyTimer);
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    loading,
    isRecoveryMode,
    
    // Updated SignIn with Paranoid Check
    signIn: async (data) => {
        const response = await supabase.auth.signInWithPassword(data);
        if (response.data.session) {
            const { error: userError } = await supabase.auth.getUser(response.data.session.access_token);
            if (userError) {
                console.warn("Ghost login detected. Forcing logout.");
                await supabase.auth.signOut();
                return { error: { message: "This account has been deleted." } };
            }
        }
        return response;
    },

    signUp: (data) => supabase.auth.signUp(data),
    signOut: () => supabase.auth.signOut(),
    
    // Updated Reset with Email Check
    resetPassword: async (email) => {
        const { data: exists, error: checkError } = await supabase.rpc('check_email_exists', { email_to_check: email });
        if (checkError) throw checkError;
        if (!exists) throw new Error("No account found with this email address.");

        return supabase.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin + '/update-password', // Points to update page
        });
    },

    updatePassword: async (newPassword) => {
        const { data, error } = await supabase.auth.updateUser({ password: newPassword });
        if (!error) setIsRecoveryMode(false);
        return { data, error };
    },

    deleteAccount: async () => {
        const { error } = await supabase.rpc('delete_my_account');
        if (error) throw error;
        await supabase.auth.signOut();
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : (
        <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
           <div className="flex flex-col items-center gap-4">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
             <p className="text-slate-400 text-sm">Loading PortraCV...</p>
           </div>
        </div>
      )}
    </AuthContext.Provider>
  );
};