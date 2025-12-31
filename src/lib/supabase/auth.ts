import { createClient } from "./client";
import type { Provider } from "@supabase/supabase-js";

/**
 * Generic OAuth sign in
 */
export async function signInWithOAuth(provider: Provider) {
  const supabase = createClient();

  const options: Record<string, unknown> = {
    redirectTo: `${window.location.origin}/auth/callback`,
  };

  // Provider-specific options
  if (provider === "google") {
    options.queryParams = {
      access_type: "offline",
      prompt: "consent",
    };
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options,
  });

  return { data, error };
}

/**
 * Sign in with Google OAuth
 */
export async function signInWithGoogle() {
  return signInWithOAuth("google");
}

/**
 * Sign in with Apple OAuth
 */
export async function signInWithApple() {
  return signInWithOAuth("apple");
}

/**
 * Sign out the current user
 */
export async function signOut() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  return { error };
}

/**
 * Get the current session
 */
export async function getSession() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getSession();
  return { session: data.session, error };
}

/**
 * Get the current user
 */
export async function getUser() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  return { user: data.user, error };
}
