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
  nextAuthUrl: optional("NEXTAUTH_URL", "http://localhost:3000"),
  nextAuthSecret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || (process.env.NODE_ENV === "production" ? required("NEXTAUTH_SECRET") : "dev-nextauth-secret-skillsync-32-chars-long"),

  // Auth providers
  github: {
    clientId: optional("GITHUB_CLIENT_ID", process.env.AUTH_GITHUB_ID || ""),
    clientSecret: optional("GITHUB_CLIENT_SECRET", process.env.AUTH_GITHUB_SECRET || ""),
  },

  // Storage
  supabase: {
    url: optional("SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL || ""),
    serviceRoleKey: optional("SUPABASE_SERVICE_ROLE_KEY", ""),
  },

  // Evidence verification
  ocrSpaceApiKey: optional("OCR_SPACE_API_KEY"),
  githubToken: optional("GITHUB_TOKEN"),

  // Opportunity ingestion & scrapers (never hardcode fallback API tokens)
  linkedinScraperApiKey: optional("LINKEDIN_SCRAPER_API_KEY"),
  apifyApiKey: optional("APIFY_API_KEY"),

  // Matching
  huggingfaceApiKey: optional("HUGGINGFACE_API_KEY"),

  // Cron protection
  cronSecret: optional("CRON_SECRET"),
};
