// Single source of truth for every environment variable the backend uses.
// Import THIS file everywhere instead of touching process.env directly.

function required(name) {
  const value = process.env[name];
  if (!value) {
    if (process.env.NODE_ENV !== "production") {
      return `dev-placeholder-${name.toLowerCase()}`;
    }
    throw new Error(`Missing required env var: ${name}. Check your .env.local / Vercel project settings.`);
  }
  return value;
}

function optional(name, fallback = undefined) {
  return process.env[name] ?? fallback;
}

export const env = {
  // Environment flags
  isProduction: process.env.NODE_ENV === "production",
  isDevelopment: process.env.NODE_ENV !== "production",

  // Core
  databaseUrl: required("DATABASE_URL"),
  nextAuthUrl: required("NEXTAUTH_URL"),
  nextAuthSecret: required("NEXTAUTH_SECRET"),

  // Auth providers
  github: {
    clientId: required("GITHUB_CLIENT_ID"),
    clientSecret: required("GITHUB_CLIENT_SECRET"),
  },

  // Storage
  supabase: {
    url: required("SUPABASE_URL"),
    serviceRoleKey: required("SUPABASE_SERVICE_ROLE_KEY"),
  },

  // Evidence verification
  ocrSpaceApiKey: optional("OCR_SPACE_API_KEY"),
  githubToken: optional("GITHUB_TOKEN"), // separate PAT for the Octokit cross-check calls, not the OAuth app above

  // Opportunity ingestion & scrapers
  linkedinScraperApiKey: optional("LINKEDIN_SCRAPER_API_KEY", "e9801deb-92ea-427c-a6e2-468c39e505a4"),

  // Matching
  huggingfaceApiKey: optional("HUGGINGFACE_API_KEY"),

  // Cron protection
  cronSecret: optional("CRON_SECRET", "skillsync-cron-secret-token"),
};
