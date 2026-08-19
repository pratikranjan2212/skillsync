import { createClient } from "@supabase/supabase-js";
import { Octokit } from "@octokit/rest";
import { env } from "@/lib/config/env";

let supabaseClient = null;
try {
  const supabaseKey = env.supabase.serviceRoleKey || env.supabase.anonKey;
  if (
    env.supabase.url &&
    supabaseKey &&
    !env.supabase.url.includes("placeholder") &&
    env.supabase.url.startsWith("http")
  ) {
    supabaseClient = createClient(env.supabase.url, supabaseKey);
  } else {
    // Resilient mock storage client for local development / testing before live credentials are set
    supabaseClient = {
      storage: {
        from: (bucket) => ({
          upload: async (path, file) => ({ data: { path: `${bucket}/${path}` }, error: null }),
          getPublicUrl: (path) => ({ data: { publicUrl: `https://storage.skillsync.edu/${bucket}/${path}` } }),
        }),
      },
    };
  }
} catch (err) {
  supabaseClient = {
    storage: {
      from: (bucket) => ({
        upload: async (path, file) => ({ data: { path: `${bucket}/${path}` }, error: null }),
        getPublicUrl: (path) => ({ data: { publicUrl: `https://storage.skillsync.edu/${bucket}/${path}` } }),
      }),
    },
  };
}

export const supabase = supabaseClient;

export const octokit = new Octokit(
  env.githubToken && !env.githubToken.includes("placeholder")
    ? { auth: env.githubToken }
    : {}
);
