import React, { createContext, useContext, useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Get the initial session
    const getInitialSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) {
        console.error("Error getting initial session:", error);
      }
      setSession(session);
      setUser(session?.user ?? null);

      // If there's a user, check onboarding status and role
      if (session?.user) {
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("has_onboarded, role")
          .eq("id", session.user.id)
          .single();

        if (profileError && profileError.code !== "PGRST116") {
          console.error("Error fetching user profile:", profileError);
        }

        if (profile && profile.has_onboarded === false) {
          navigate("/payment", { replace: true });
        } else if (profile && profile.role === "admin") {
          navigate("/admin", { replace: true });
        } else if (profile && profile.role === "staff") {
          navigate("/staff", { replace: true });
        } else {
          navigate("/dashboard", { replace: true });
        }
      }

      // Set loading to false after a short delay to ensure UI stability
      setTimeout(() => setLoading(false), 100);
    };

    getInitialSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        // This listener handles auth state changes after initial load
        setSession(session);
        setUser(session?.user ?? null);

        // On signing in (not initial session)
        if (_event === "SIGNED_IN" && session?.user) {
          const { data: profile, error } = await supabase
            .from("profiles")
            .select("has_onboarded, role")
            .eq("id", session.user.id)
            .single();

          if (error && error.code !== "PGRST116") {
            console.error("Error fetching user profile:", error);
          }

          if (profile && profile.has_onboarded === false) {
            navigate("/payment", { replace: true });
          } else if (profile && profile.role === "admin") {
            navigate("/admin", { replace: true });
          } else if (profile && profile.role === "staff") {
            navigate("/staff", { replace: true });
          } else {
            navigate("/dashboard", { replace: true });
          }
        }
      }
    );

    // The cleanup function for the useEffect hook, which unsubscribes from the auth listener.
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
