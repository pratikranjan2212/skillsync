import assert from "assert";
import {
  getFirstEnv,
  resolveDatabaseUrl,
  resolveDirectDatabaseUrl,
  resolveSupabaseConfig,
} from "../lib/config/env.js";

console.log("------------------------------------------------------------");
console.log("Running SkillSync Environment & Database Resolution Unit Tests");
console.log("------------------------------------------------------------\n");

let passed = 0;
let total = 0;

function runTest(name, fn) {
  total++;
  try {
    fn();
    console.log(`✓ PASS: ${name}`);
    passed++;
  } catch (err) {
    console.error(`✗ FAIL: ${name}`);
    console.error(`  Error: ${err.message}`);
  }
}

// Save initial env to restore later
const originalEnv = { ...process.env };

function resetEnv() {
  process.env = { ...originalEnv };
}

function clearRelevantVars() {
  const varsToClear = [
    "DATABASE_URL",
    "DIRECT_URL",
    "STORAGE_POSTGRES_PRISMA_URL",
    "STORAGE_POSTGRES_URL",
    "STORAGE_POSTGRES_URL_NON_POOLING",
    "STORAGE_POSTGRES_HOST",
    "STORAGE_POSTGRES_USER",
    "STORAGE_POSTGRES_PASSWORD",
    "STORAGE_POSTGRES_DATABASE",
    "POSTGRES_PRISMA_URL",
    "POSTGRES_URL",
    "SUPABASE_URL",
    "SUPABASE_SERVICE_ROLE_KEY",
    "SUPABASE_SECRET_KEY",
    "SUPABASE_ANON_KEY",
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "STORAGE_SUPABASE_URL",
    "STORAGE_SUPABASE_SERVICE_ROLE_KEY",
    "STORAGE_SUPABASE_SECRET_KEY",
    "STORAGE_SUPABASE_ANON_KEY",
    "STORAGE_SUPABASE_PUBLISHABLE_KEY",
    "STORAGE_SUPABASE_JWT_SECRET",
    "NEXT_PUBLIC_STORAGE_SUPABASE_URL",
    "NEXT_PUBLIC_STORAGE_SUPABASE_ANON_KEY",
    "NEXT_PUBLIC_STORAGE_SUPABASE_PUBLISHABLE_KEY",
  ];
  for (const v of varsToClear) {
    delete process.env[v];
  }
}

try {
  // Test 1: STORAGE_POSTGRES_PRISMA_URL prioritization
  runTest("Database Resolution: Prioritizes STORAGE_POSTGRES_PRISMA_URL when present", () => {
    clearRelevantVars();
    process.env.STORAGE_POSTGRES_PRISMA_URL = "postgresql://postgres.test:secret@aws-0-pooler.supabase.com:5432/postgres?sslmode=require&supavisor=true";
    process.env.DATABASE_URL = "postgresql://postgres:fallback@localhost:5432/local";

    const resolved = resolveDatabaseUrl();
    assert.strictEqual(resolved, "postgresql://postgres.test:secret@aws-0-pooler.supabase.com:5432/postgres?sslmode=require&supavisor=true");
  });

  // Test 2: STORAGE_POSTGRES_URL fallback
  runTest("Database Resolution: Uses STORAGE_POSTGRES_URL when PRISMA_URL is absent", () => {
    clearRelevantVars();
    process.env.STORAGE_POSTGRES_URL = "postgresql://postgres.test:secret@aws-0-direct.supabase.com:5432/postgres?sslmode=require";

    const resolved = resolveDatabaseUrl();
    assert.strictEqual(resolved, "postgresql://postgres.test:secret@aws-0-direct.supabase.com:5432/postgres?sslmode=require");
  });

  // Test 3: Synthesis from individual connection components
  runTest("Database Resolution: Synthesizes URL from STORAGE_POSTGRES_USER, HOST, PASSWORD, DATABASE", () => {
    clearRelevantVars();
    process.env.STORAGE_POSTGRES_USER = "postgres.myproject";
    process.env.STORAGE_POSTGRES_PASSWORD = "my#secret!password";
    process.env.STORAGE_POSTGRES_HOST = "aws-0-ap-south-1.pooler.supabase.com";
    process.env.STORAGE_POSTGRES_DATABASE = "postgres";

    const resolved = resolveDatabaseUrl();
    assert.strictEqual(
      resolved,
      "postgresql://postgres.myproject:my%23secret!password@aws-0-ap-south-1.pooler.supabase.com:5432/postgres?sslmode=require"
    );
  });

  // Test 4: Direct unpooled URL resolution
  runTest("Direct URL Resolution: Resolves STORAGE_POSTGRES_URL_NON_POOLING for migrations", () => {
    clearRelevantVars();
    process.env.STORAGE_POSTGRES_URL_NON_POOLING = "postgresql://postgres:secret@db.supabase.co:5432/postgres";

    const direct = resolveDirectDatabaseUrl();
    assert.strictEqual(direct, "postgresql://postgres:secret@db.supabase.co:5432/postgres");
  });

  // Test 5: STORAGE_SUPABASE_URL and NEXT_PUBLIC_STORAGE_SUPABASE_URL
  runTest("Supabase URL Resolution: Resolves STORAGE_SUPABASE_URL or NEXT_PUBLIC_STORAGE_SUPABASE_URL", () => {
    clearRelevantVars();
    process.env.STORAGE_SUPABASE_URL = "https://my-storage-proj.supabase.co";

    const config = resolveSupabaseConfig();
    assert.strictEqual(config.url, "https://my-storage-proj.supabase.co");

    clearRelevantVars();
    process.env.NEXT_PUBLIC_STORAGE_SUPABASE_URL = "https://public-storage-proj.supabase.co";
    const config2 = resolveSupabaseConfig();
    assert.strictEqual(config2.url, "https://public-storage-proj.supabase.co");
  });

  // Test 6: Supabase Service Role and Secret Keys
  runTest("Supabase Key Resolution: Resolves STORAGE_SUPABASE_SERVICE_ROLE_KEY & STORAGE_SUPABASE_SECRET_KEY", () => {
    clearRelevantVars();
    process.env.STORAGE_SUPABASE_SERVICE_ROLE_KEY = "service-role-key-xyz";

    const config = resolveSupabaseConfig();
    assert.strictEqual(config.serviceRoleKey, "service-role-key-xyz");

    clearRelevantVars();
    process.env.STORAGE_SUPABASE_SECRET_KEY = "secret-key-abc";
    const config2 = resolveSupabaseConfig();
    assert.strictEqual(config2.serviceRoleKey, "secret-key-abc");
  });

  // Test 7: Supabase Anon and Publishable Keys
  runTest("Supabase Anon Key Resolution: Resolves NEXT_PUBLIC_STORAGE_SUPABASE_ANON_KEY & PUBLISHABLE_KEY", () => {
    clearRelevantVars();
    process.env.NEXT_PUBLIC_STORAGE_SUPABASE_ANON_KEY = "anon-key-123";

    const config = resolveSupabaseConfig();
    assert.strictEqual(config.anonKey, "anon-key-123");

    clearRelevantVars();
    process.env.STORAGE_SUPABASE_PUBLISHABLE_KEY = "pub-key-456";
    const config2 = resolveSupabaseConfig();
    assert.strictEqual(config2.anonKey, "pub-key-456");
  });

  // Test 8: Supabase JWT Secret Resolution
  runTest("Supabase JWT Secret: Resolves STORAGE_SUPABASE_JWT_SECRET", () => {
    clearRelevantVars();
    process.env.STORAGE_SUPABASE_JWT_SECRET = "jwt-secret-token-789";

    const config = resolveSupabaseConfig();
    assert.strictEqual(config.jwtSecret, "jwt-secret-token-789");
  });

  // Test 9: Backward compatibility with standard variables
  runTest("Backward Compatibility: Seamlessly resolves standard DATABASE_URL & SUPABASE_* variables", () => {
    clearRelevantVars();
    process.env.DATABASE_URL = "postgresql://postgres:standard@db.com:5432/db";
    process.env.SUPABASE_URL = "https://standard.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "standard-service-key";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "standard-anon-key";

    const dbUrl = resolveDatabaseUrl();
    const config = resolveSupabaseConfig();

    assert.strictEqual(dbUrl, "postgresql://postgres:standard@db.com:5432/db");
    assert.strictEqual(config.url, "https://standard.supabase.co");
    assert.strictEqual(config.serviceRoleKey, "standard-service-key");
    assert.strictEqual(config.anonKey, "standard-anon-key");
  });

  console.log("\n------------------------------------------------------------");
  console.log(`Results: ${passed} / ${total} tests passed (${Math.round((passed / total) * 100)}%)`);
  console.log("------------------------------------------------------------\n");

  if (passed !== total) {
    process.exit(1);
  }
} finally {
  resetEnv();
}
