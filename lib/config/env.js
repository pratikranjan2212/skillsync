// Single source of truth for every environment variable the backend uses.
// Import THIS file everywhere instead of touching process.env directly.

export function getFirstEnv(names, fallback = undefined) {
  for (const name of names) {
    const val = process.env[name];
    if (val !== undefined && val !== null && String(val).trim() !== "") {
      return String(val).trim();
    }
  }
  return fallback;
}

export function resolveDatabaseUrl() {
  // 1. Direct connection URL candidates (Prisma pooler, standard URL, or direct)
  const candidate = getFirstEnv([
    "STORAGE_POSTGRES_PRISMA_URL",
    "STORAGE_POSTGRES_URL",
    "DATABASE_URL",
    "POSTGRES_PRISMA_URL",
    "POSTGRES_URL",
    "STORAGE_POSTGRES_URL_NON_POOLING",
    "DIRECT_URL",
  ]);

  if (candidate) {
    return candidate;
  }

  // 2. Synthesize from individual connection parameters if present
  const user = getFirstEnv(["STORAGE_POSTGRES_USER", "POSTGRES_USER", "PGUSER"]);
  const password = getFirstEnv(["STORAGE_POSTGRES_PASSWORD", "POSTGRES_PASSWORD", "PGPASSWORD"]);
  const host = getFirstEnv(["STORAGE_POSTGRES_HOST", "POSTGRES_HOST", "PGHOST"]);
  const database = getFirstEnv(["STORAGE_POSTGRES_DATABASE", "POSTGRES_DATABASE", "POSTGRES_DB", "PGDATABASE"], "postgres");

  if (user && password && host) {
    return `postgresql://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:5432/${database}?sslmode=require`;
  }

  if (process.env.NODE_ENV !== "production") {
    return "dev-placeholder-database_url";
  }

  throw new Error(
    "Missing required database connection URL (DATABASE_URL, STORAGE_POSTGRES_PRISMA_URL, or STORAGE_POSTGRES_URL). Check your .env / Vercel project settings."
  );
}

export function resolveDirectDatabaseUrl() {
  return getFirstEnv([
    "STORAGE_POSTGRES_URL_NON_POOLING",
    "DIRECT_URL",
    "POSTGRES_URL_NON_POOLING",
    "DATABASE_URL_UNPOOLED",
  ], undefined);
}

export function resolveSupabaseConfig() {
  const url = getFirstEnv([
    "STORAGE_SUPABASE_URL",
    "NEXT_PUBLIC_STORAGE_SUPABASE_URL",
    "SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_URL",
  ], "");

  const serviceRoleKey = getFirstEnv([
    "STORAGE_SUPABASE_SERVICE_ROLE_KEY",
    "STORAGE_SUPABASE_SECRET_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "SUPABASE_SECRET_KEY",
    "STORAGE_SUPABASE_ANON_KEY",
    "NEXT_PUBLIC_STORAGE_SUPABASE_ANON_KEY",
    "SUPABASE_ANON_KEY",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  ], "");

  const anonKey = getFirstEnv([
    "NEXT_PUBLIC_STORAGE_SUPABASE_ANON_KEY",
    "STORAGE_SUPABASE_ANON_KEY",
    "NEXT_PUBLIC_STORAGE_SUPABASE_PUBLISHABLE_KEY",
    "STORAGE_SUPABASE_PUBLISHABLE_KEY",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_ANON_KEY",
  ], "");

  const jwtSecret = getFirstEnv([
    "STORAGE_SUPABASE_JWT_SECRET",
    "SUPABASE_JWT_SECRET",
  ], "");

  return {
    url,
    serviceRoleKey,
    anonKey,
    jwtSecret,
  };
}

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

const resolvedDbUrl = resolveDatabaseUrl();
const resolvedDirectUrl = resolveDirectDatabaseUrl();
const resolvedSupabase = resolveSupabaseConfig();

// Ensure process.env.DATABASE_URL is populated for libraries that inspect it directly
if (resolvedDbUrl && (!process.env.DATABASE_URL || process.env.DATABASE_URL.startsWith("dev-placeholder"))) {
  process.env.DATABASE_URL = resolvedDbUrl;
}
if (resolvedDirectUrl && !process.env.DIRECT_URL) {
  process.env.DIRECT_URL = resolvedDirectUrl;
}
if (resolvedSupabase.url && !process.env.SUPABASE_URL) {
  process.env.SUPABASE_URL = resolvedSupabase.url;
}
if (resolvedSupabase.url && !process.env.NEXT_PUBLIC_SUPABASE_URL) {
  process.env.NEXT_PUBLIC_SUPABASE_URL = resolvedSupabase.url;
}
if (resolvedSupabase.serviceRoleKey && !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  process.env.SUPABASE_SERVICE_ROLE_KEY = resolvedSupabase.serviceRoleKey;
}
if (resolvedSupabase.anonKey && !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = resolvedSupabase.anonKey;
}

export const env = {
  // Environment flags
  isProduction: process.env.NODE_ENV === "production",
  isDevelopment: process.env.NODE_ENV !== "production",

  // Core Database
  databaseUrl: resolvedDbUrl,
  directUrl: resolvedDirectUrl,
  nextAuthUrl: getFirstEnv(["NEXTAUTH_URL", "AUTH_URL"], "http://localhost:3000"),
  nextAuthSecret:
    process.env.NEXTAUTH_SECRET ||
    process.env.AUTH_SECRET ||
    (process.env.NODE_ENV === "production"
      ? required("NEXTAUTH_SECRET")
      : "dev-nextauth-secret-skillsync-32-chars-long"),

  // Auth providers
  github: {
    clientId: getFirstEnv(["GITHUB_CLIENT_ID", "AUTH_GITHUB_ID"], "Ov23liWiSbpa2nhZP7ZG"),
    clientSecret: getFirstEnv(["GITHUB_CLIENT_SECRET", "AUTH_GITHUB_SECRET"], "e7e7970eba317771be00f3e98fe3403ddc66c5cb"),
  },
  google: {
    clientId: getFirstEnv(["GOOGLE_CLIENT_ID", "AUTH_GOOGLE_ID"], "833003111589-pfeuls9uiae76fidkf83ib0u62gargn6.apps.googleusercontent.com"),
    clientSecret: getFirstEnv(["GOOGLE_CLIENT_SECRET", "AUTH_GOOGLE_SECRET"], "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"),
  },
  linkedin: {
    clientId: getFirstEnv(["LINKEDIN_CLIENT_ID", "AUTH_LINKEDIN_ID"], "77e0v5zvxy4r93"),
    clientSecret: getFirstEnv(["LINKEDIN_CLIENT_SECRET", "AUTH_LINKEDIN_SECRET"], "WPL_AP1.bBKFbLn61jMfxkPq.iT2KWA=="),
  },

  // Storage & Supabase
  supabase: resolvedSupabase,

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
