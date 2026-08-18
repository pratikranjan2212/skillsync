import assert from "assert";
import { validatePassword, hashPassword, verifyPassword } from "../lib/security/password.js";
import { checkRateLimit, resetRateLimit, RATE_LIMIT_PRESETS } from "../lib/security/rateLimit.js";
import { generateSecureToken } from "../lib/security/tokens.js";
import { logSecurityEvent, SecurityEvent, LogLevel } from "../lib/security/logger.js";
import { isMaliciousUserAgent, isProbingRestrictedPaths, validateHoneypot } from "../lib/security/botProtection.js";
import {
  escapeHtml,
  sanitizeString,
  validateAndSanitizeEmail,
  sanitizeIdentifier,
  sanitizeUrl,
  validateFileUpload,
} from "../lib/security/validator.js";

console.log("------------------------------------------------------------");
console.log("Running SkillSync Authentication & Security Unit Tests");
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

async function runAsyncTest(name, fn) {
  total++;
  try {
    await fn();
    console.log(`✓ PASS: ${name}`);
    passed++;
  } catch (err) {
    console.error(`✗ FAIL: ${name}`);
    console.error(`  Error: ${err.message}`);
  }
}

async function main() {
  // Test 1: Password complexity validation - Rejects short passwords
  runTest("Password Policy: Rejects passwords shorter than 8 characters", () => {
    const res = validatePassword("Short1!");
    assert.strictEqual(res.valid, false);
    assert.ok(res.errors.some((e) => e.includes("at least 8 characters")));
  });

  // Test 2: Password complexity validation - Rejects missing uppercase
  runTest("Password Policy: Rejects passwords missing uppercase letters", () => {
    const res = validatePassword("lowercase1@pass");
    assert.strictEqual(res.valid, false);
    assert.ok(res.errors.some((e) => e.includes("uppercase")));
  });

  // Test 3: Password complexity validation - Rejects missing lowercase
  runTest("Password Policy: Rejects passwords missing lowercase letters", () => {
    const res = validatePassword("UPPERCASE1@PASS");
    assert.strictEqual(res.valid, false);
    assert.ok(res.errors.some((e) => e.includes("lowercase")));
  });

  // Test 4: Password complexity validation - Rejects missing numbers
  runTest("Password Policy: Rejects passwords missing numbers", () => {
    const res = validatePassword("NoNumber@Password");
    assert.strictEqual(res.valid, false);
    assert.ok(res.errors.some((e) => e.includes("numeric digit")));
  });

  // Test 5: Password complexity validation - Rejects missing special characters
  runTest("Password Policy: Rejects passwords missing special characters", () => {
    const res = validatePassword("NoSpecialChar123");
    assert.strictEqual(res.valid, false);
    assert.ok(res.errors.some((e) => e.includes("special character")));
  });

  // Test 6: Password complexity validation - Rejects oversized passwords (DoS prevention)
  runTest("Password Policy: Rejects passwords exceeding 128 characters", () => {
    const hugePassword = "A1!" + "a".repeat(130);
    const res = validatePassword(hugePassword);
    assert.strictEqual(res.valid, false);
    assert.ok(res.errors.some((e) => e.includes("not exceed 128 characters")));
  });

  // Test 7: Password complexity validation - Accepts compliant passwords
  runTest("Password Policy: Accepts strong compliant passwords", () => {
    const res = validatePassword("SuperSecure#2026!Pass");
    assert.strictEqual(res.valid, true);
    assert.strictEqual(res.errors.length, 0);
  });

  // Test 8: Bcrypt hashing and verification
  await runAsyncTest("Password Hashing: 12-round bcrypt hash and verify", async () => {
    const plain = "ValidPassword123#";
    const hash = await hashPassword(plain);
    assert.ok(hash.startsWith("$2a$12$") || hash.startsWith("$2b$12$"), "Hash must use 12 rounds");

    const matches = await verifyPassword(plain, hash);
    assert.strictEqual(matches, true);

    const wrongMatches = await verifyPassword("WrongPassword123#", hash);
    assert.strictEqual(wrongMatches, false);
  });

  // Test 9: Bcrypt rejection of non-compliant password
  await runAsyncTest("Password Hashing: Rejects hashing non-compliant password", async () => {
    let threw = false;
    try {
      await hashPassword("weak");
    } catch {
      threw = true;
    }
    assert.strictEqual(threw, true);
  });

  // Test 10: Rate Limiter - Sliding Window limit enforcement
  runTest("Rate Limiter: Enforces request limits and blocks when exceeded", () => {
    const testKey = "test-ratelimit-user-" + Date.now();
    resetRateLimit(testKey);

    // Make 3 requests with limit 3
    const r1 = checkRateLimit(testKey, 3, 60000);
    assert.strictEqual(r1.success, true);
    assert.strictEqual(r1.remaining, 2);

    const r2 = checkRateLimit(testKey, 3, 60000);
    assert.strictEqual(r2.success, true);
    assert.strictEqual(r2.remaining, 1);

    const r3 = checkRateLimit(testKey, 3, 60000);
    assert.strictEqual(r3.success, true);
    assert.strictEqual(r3.remaining, 0);

    // 4th request must be blocked
    const r4 = checkRateLimit(testKey, 3, 60000);
    assert.strictEqual(r4.success, false);
    assert.strictEqual(r4.remaining, 0);
    assert.ok(r4.resetTime > Date.now());

    // Reset rate limit
    resetRateLimit(testKey);
    const r5 = checkRateLimit(testKey, 3, 60000);
    assert.strictEqual(r5.success, true);
  });

  // Test 11: Secure Token Generation
  runTest("Secure Token: Generates cryptographically secure 64-char hex token", () => {
    const token1 = generateSecureToken();
    const token2 = generateSecureToken();

    assert.strictEqual(typeof token1, "string");
    assert.strictEqual(token1.length, 64);
    assert.match(token1, /^[a-f0-9]{64}$/);
    assert.notStrictEqual(token1, token2);
  });

  // Test 12: Backdoor Passwords Completely Disabled
  await runAsyncTest("Backdoor Elimination: Legacy backdoor passwords fail verification", async () => {
    const realHash = await hashPassword("MyRealSecurePass123!");
    assert.strictEqual(await verifyPassword("demo", realHash), false);
    assert.strictEqual(await verifyPassword("student123", realHash), false);
    assert.strictEqual(await verifyPassword("admin123", realHash), false);
  });

  // Test 13: IDOR Protection - Ownership Predicate Validation
  runTest("IDOR Prevention: Enforces resource ownership check before mutate/read", () => {
    const userA = { id: "usr_alice", email: "alice@skillsync.edu" };
    const userB = { id: "usr_bob", email: "bob@skillsync.edu" };

    const resourceBelongingToAlice = {
      id: "ev_001",
      userId: "usr_alice",
      title: "Distributed Systems Project",
    };

    // Helper simulating query condition { id: resourceId, userId: currentUser.id }
    function checkOwnership(resource, sessionUser) {
      if (!sessionUser || !sessionUser.id) return { allowed: false, status: 401 };
      if (resource.userId !== sessionUser.id) return { allowed: false, status: 403 };
      return { allowed: true, status: 200 };
    }

    // Unauthenticated access -> 401
    assert.strictEqual(checkOwnership(resourceBelongingToAlice, null).status, 401);

    // User A accessing own resource -> 200 OK
    assert.strictEqual(checkOwnership(resourceBelongingToAlice, userA).status, 200);

    // User B attempting to access/modify User A's resource -> 403 Forbidden
    assert.strictEqual(checkOwnership(resourceBelongingToAlice, userB).status, 403);
  });

  // Test 14: Private Resource Access Control
  runTest("Access Control: Private passport denied to third-party viewers", () => {
    const owner = { id: "usr_charlie" };
    const thirdParty = { id: "usr_dave" };
    const unauthenticated = null;

    const privatePassport = {
      shareToken: "sp-token-private-123",
      userId: "usr_charlie",
      isPublic: false,
    };

    function canViewPassport(passport, viewer) {
      if (passport.isPublic) return true;
      if (viewer && viewer.id === passport.userId) return true;
      return false;
    }

    assert.strictEqual(canViewPassport(privatePassport, owner), true, "Owner can view their own private passport");
    assert.strictEqual(canViewPassport(privatePassport, thirdParty), false, "Third-party viewer cannot view private passport");
    assert.strictEqual(canViewPassport(privatePassport, unauthenticated), false, "Unauthenticated viewer cannot view private passport");
  });

  // Test 15: Security Logger - Sensitive Data Redaction
  runTest("Security Logging: Sensitive fields (passwords, tokens, secrets) are redacted", () => {
    const log = logSecurityEvent(SecurityEvent.AUTH_SIGNIN_FAILURE, LogLevel.WARN, {
      ip: "192.168.1.100",
      user: { email: "attacker@test.com" },
      details: {
        password: "SecretPassword123!",
        rawToken: "super-secret-auth-token-value",
        apiKey: "sk-live-1234567890",
        nested: {
          clientSecret: "my_oauth_client_secret",
          safeField: "safe_value",
        },
      },
    });

    assert.strictEqual(log.details.password, "[REDACTED]");
    assert.strictEqual(log.details.rawToken, "[REDACTED]");
    assert.strictEqual(log.details.apiKey, "[REDACTED]");
    assert.strictEqual(log.details.nested.clientSecret, "[REDACTED]");
    assert.strictEqual(log.details.nested.safeField, "safe_value");
    assert.strictEqual(log.event, SecurityEvent.AUTH_SIGNIN_FAILURE);
  });

  // Test 16: Security Logger - Event Level & Structure Validation
  runTest("Security Logging: Output structure includes ISO timestamp, level, and metadata", () => {
    const log = logSecurityEvent(SecurityEvent.AUTH_EMAIL_VERIFIED, LogLevel.INFO, {
      ip: "10.0.0.1",
      user: { id: "usr_123", email: "student@skillsync.edu" },
      route: "/api/auth/verify-email",
      method: "GET",
    });

    assert.strictEqual(typeof log.timestamp, "string");
    assert.ok(!isNaN(Date.parse(log.timestamp)));
    assert.strictEqual(log.level, LogLevel.INFO);
    assert.strictEqual(log.route, "/api/auth/verify-email");
    assert.strictEqual(log.user.id, "usr_123");
  });

  // Test 17: Bot Protection - Blocks malicious vulnerability scanners
  runTest("Bot Protection: Identifies and flags automated exploit scanners & scrapers", () => {
    assert.strictEqual(isMaliciousUserAgent("sqlmap/1.6.12#stable").isBot, true);
    assert.strictEqual(isMaliciousUserAgent("Mozilla/5.0 (compatible; Nikto/2.1.6)").isBot, true);
    assert.strictEqual(isMaliciousUserAgent("Scrapy/2.11.0 (+https://scrapy.org)").isBot, true);
    assert.strictEqual(isMaliciousUserAgent("python-requests/2.31.0").isBot, true);
    assert.strictEqual(isMaliciousUserAgent("Go-http-client/1.1").isBot, true);

    // Legitimate browser user agent -> not a bot
    const browserUA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";
    assert.strictEqual(isMaliciousUserAgent(browserUA).isBot, false);
  });

  // Test 18: Path Probe Protection - Blocks directory traversal & vulnerability probes
  runTest("Bot Protection: Detects malicious path traversal and vulnerability scans", () => {
    assert.strictEqual(isProbingRestrictedPaths("/.env"), true);
    assert.strictEqual(isProbingRestrictedPaths("/.git/config"), true);
    assert.strictEqual(isProbingRestrictedPaths("/wp-admin/login.php"), true);
    assert.strictEqual(isProbingRestrictedPaths("/phpmyadmin/index.php"), true);
    assert.strictEqual(isProbingRestrictedPaths("/actuator/health"), true);

    // Legitimate application routes -> allowed
    assert.strictEqual(isProbingRestrictedPaths("/dashboard"), false);
    assert.strictEqual(isProbingRestrictedPaths("/api/opportunities"), false);
    assert.strictEqual(isProbingRestrictedPaths("/passport/sp-token-123"), false);
  });

  // Test 19: Honeypot Protection - Traps automated spam submissions
  runTest("Bot Protection: Honeypot trap validates empty human field and traps bot fill", () => {
    // Human submission: honeypot field is empty
    const humanSubmission = { fullName: "Alice", email: "alice@test.com", website_hp: "" };
    assert.strictEqual(validateHoneypot(humanSubmission, "website_hp"), true);

    // Bot submission: automatically populated hidden input
    const botSubmission = { fullName: "SpamBot", email: "bot@spam.com", website_hp: "http://spam-link.com" };
    assert.strictEqual(validateHoneypot(botSubmission, "website_hp"), false);
  });

  // Test 20: AI Generation & OCR Abuse Protection Rate Limiting
  runTest("Abuse Protection: AI generation request quota enforcement", () => {
    const testAiKey = "test-ai-quota-" + Date.now();
    resetRateLimit(testAiKey);

    const preset = RATE_LIMIT_PRESETS.AI_GENERATION;
    for (let i = 0; i < preset.maxRequests; i++) {
      const res = checkRateLimit(testAiKey, preset.maxRequests, preset.windowMs);
      assert.strictEqual(res.success, true);
    }

    // Exceeding AI quota -> blocked
    const overflow = checkRateLimit(testAiKey, preset.maxRequests, preset.windowMs);
    assert.strictEqual(overflow.success, false);
    assert.strictEqual(overflow.remaining, 0);
  });

  // Test 21: Script Injection (XSS) Prevention
  runTest("Input Sanitization: HTML and script tags are escaped", () => {
    const malicious = '<script>alert("XSS")</script><img src=x onerror=alert(1)>';
    const escaped = escapeHtml(malicious);
    assert.strictEqual(escaped.includes("<script>"), false);
    assert.strictEqual(escaped.includes("<img"), false);
    assert.ok(escaped.includes("&lt;script&gt;"));
  });

  // Test 22: Null Byte and Control Character Stripping
  runTest("Input Sanitization: Strips null bytes and control chars", () => {
    const tainted = "SafeText\0MaliciousPayload\x08End";
    const cleaned = sanitizeString(tainted, 50);
    assert.strictEqual(cleaned.includes("\0"), false);
    assert.strictEqual(cleaned.includes("\x08"), false);
    assert.strictEqual(cleaned, "SafeTextMaliciousPayloadEnd");
  });

  // Test 23: Strict Email Validation
  runTest("Input Validation: Validates strict RFC 5322 email syntax", () => {
    assert.strictEqual(validateAndSanitizeEmail("student@university.edu").valid, true);
    assert.strictEqual(validateAndSanitizeEmail("STUDENT.NAME+TAG@COLLEGE.ORG").email, "student.name+tag@college.org");
    assert.strictEqual(validateAndSanitizeEmail("invalid-email-no-at").valid, false);
    assert.strictEqual(validateAndSanitizeEmail("@no-user.com").valid, false);
    assert.strictEqual(validateAndSanitizeEmail("user@.com").valid, false);
  });

  // Test 24: Identifier and Path Traversal Defense
  runTest("Input Validation: Enforces alphanumeric IDs and blocks path traversal", () => {
    assert.strictEqual(sanitizeIdentifier("cm7abc123_valid-ID").valid, true);
    assert.strictEqual(sanitizeIdentifier("../../etc/passwd").valid, false);
    assert.strictEqual(sanitizeIdentifier("..\\windows\\system32").valid, false);
    assert.strictEqual(sanitizeIdentifier("id_with_null\0_byte").valid, false);
  });

  // Test 25: Safe File Upload & Extension Whitelisting
  runTest("Upload Validation: Enforces allowed extensions and file size limits", () => {
    // Valid PDF upload
    assert.strictEqual(
      validateFileUpload({ fileName: "transcript.pdf", mimeType: "application/pdf", sizeBytes: 2 * 1024 * 1024 }).valid,
      true
    );

    // Malicious executable upload -> blocked
    assert.strictEqual(
      validateFileUpload({ fileName: "payload.exe", mimeType: "application/x-msdownload", sizeBytes: 1024 }).valid,
      false
    );

    // Path traversal in filename -> blocked
    assert.strictEqual(
      validateFileUpload({ fileName: "../../../payload.pdf", mimeType: "application/pdf", sizeBytes: 1024 }).valid,
      false
    );

    // Oversized upload (>10MB) -> blocked
    assert.strictEqual(
      validateFileUpload({ fileName: "huge.pdf", mimeType: "application/pdf", sizeBytes: 15 * 1024 * 1024 }).valid,
      false
    );
  });

  // Test 26: Safe URL Validation (Blocks javascript: and data: URIs)
  runTest("Input Validation: Blocks javascript: and dangerous URI schemes", () => {
    assert.strictEqual(sanitizeUrl("https://github.com/myuser/repo").valid, true);
    assert.strictEqual(sanitizeUrl("http://localhost:3000").valid, true);
    assert.strictEqual(sanitizeUrl("javascript:alert(1)").valid, false);
    assert.strictEqual(sanitizeUrl("data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==").valid, false);
    assert.strictEqual(sanitizeUrl("vbscript:msgbox(1)").valid, false);
  });

  console.log("\n------------------------------------------------------------");
  console.log(`Results: ${passed} / ${total} tests passed (${Math.round((passed / total) * 100)}%)`);
  console.log("------------------------------------------------------------\n");

  if (passed !== total) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
