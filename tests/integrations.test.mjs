import assert from "node:assert";
import { parseCourseraInput, fetchCourseraCertificates, searchCourseraCatalog, extractSkillsFromText } from "../lib/integrations/coursera.js";
import { extractLinkedInUsername, extractGitHubUsername, fetchLinkedInCertifications, extractOAuthAvatar } from "../lib/integrations/linkedin.js";
import { verifyQrPayload } from "../lib/verification/qrVerifier.js";
import { computeSha256 } from "../lib/verification/cryptoHash.js";
import { env } from "../lib/config/env.js";

console.log("------------------------------------------------------------");
console.log("Running SkillSync Coursera & LinkedIn Certificate Unit Tests");
console.log("------------------------------------------------------------\n");

let passed = 0;
let total = 0;

function test(name, fn) {
  total++;
  try {
    fn();
    console.log(`✓ PASS: ${name}`);
    passed++;
  } catch (err) {
    console.error(`✗ FAIL: ${name}`);
    console.error(err);
  }
}

async function asyncTest(name, fn) {
  total++;
  try {
    await fn();
    console.log(`✓ PASS: ${name}`);
    passed++;
  } catch (err) {
    console.error(`✗ FAIL: ${name}`);
    console.error(err);
  }
}

// 1. Environment resolution
test("Environment: Coursera API Key is loaded in configuration", () => {
  assert.ok(env.courseraApiKey, "courseraApiKey should be defined in env");
  assert.strictEqual(typeof env.courseraApiKey, "string");
  assert.ok(env.courseraApiKey.length > 10, "courseraApiKey should be a valid non-empty string");
});

// 2. Coursera URL & Handle Parsing
test("Coursera Parser: Extracts certificate ID from verify URL", () => {
  const parsed = parseCourseraInput("https://coursera.org/verify/DL99201");
  assert.strictEqual(parsed.type, "certificate_id");
  assert.strictEqual(parsed.cleanCode, "DL99201");

  const parsedSpec = parseCourseraInput("https://www.coursera.org/verify/specialization/ABC123XYZ");
  assert.strictEqual(parsedSpec.type, "certificate_id");
  assert.strictEqual(parsedSpec.cleanCode, "ABC123XYZ");
});

test("Coursera Parser: Extracts user token / code directly", () => {
  const parsed = parseCourseraInput("kwD4F3akVxOnblOGvEGtflISgvReNXBA5v3Ikvt5b7Dmc5oh");
  assert.strictEqual(parsed.type, "certificate_id");
  assert.strictEqual(parsed.cleanCode, "kwD4F3akVxOnblOGvEGtflISgvReNXBA5v3Ikvt5b7Dmc5oh");
});

// 3. Coursera Direct Verification
await asyncTest("Coursera Integration: Verifies exact certificate code without fake suggestions", async () => {
  const result = await fetchCourseraCertificates({
    courseraUrl: "https://coursera.org/verify/specialization/DL-88204-VERIFIED",
  });

  assert.strictEqual(result.success, true);
  assert.strictEqual(result.certificates.length, 1);
  const cert = result.certificates[0];
  assert.strictEqual(cert.title, "Deep Learning Specialization");
  assert.strictEqual(cert.partner, "DeepLearning.AI");
  assert.strictEqual(cert.verificationTier, "verified-high");
  assert.ok(cert.skills.includes("Python") || cert.skills.includes("Deep Learning"));
});

// 4. Coursera Empty Input Behavior (No unwanted fake presets)
await asyncTest("Coursera Integration: Returns empty list on empty query to avoid false suggestions", async () => {
  const result = await fetchCourseraCertificates({
    courseraUrl: "",
    query: "",
  });

  assert.strictEqual(result.success, true);
  assert.strictEqual(result.certificates.length, 0);
  assert.ok(result.message);
});

// 5. LinkedIn & GitHub Username Extraction
test("LinkedIn Parser: Extracts username from various LinkedIn URL formats", () => {
  assert.strictEqual(extractLinkedInUsername("https://www.linkedin.com/in/pratikranjan/"), "pratikranjan");
  assert.strictEqual(extractLinkedInUsername("https://linkedin.com/in/tonystark?utm_source=share"), "tonystark");
  assert.strictEqual(extractLinkedInUsername("peterparker"), "peterparker");
});

test("GitHub Parser: Extracts username from various GitHub URL formats", () => {
  assert.strictEqual(extractGitHubUsername("https://github.com/pratikranjan2212"), "pratikranjan2212");
  assert.strictEqual(extractGitHubUsername("https://github.com/torvalds/"), "torvalds");
  assert.strictEqual(extractGitHubUsername("@octocat"), "octocat");
  assert.strictEqual(extractGitHubUsername("ananya-sharma"), "ananya-sharma");
});

// 6. LinkedIn Credly Badge Verification
await asyncTest("LinkedIn Integration: Verifies Credly & digital badge links", async () => {
  const result = await fetchLinkedInCertifications({
    verificationUrl: "https://www.credly.com/badges/aws-certified-solutions-architect-associate",
  });

  assert.strictEqual(result.success, true);
  assert.strictEqual(result.certifications.length, 1);
  const cert = result.certifications[0];
  assert.strictEqual(cert.issuer, "Amazon Web Services (AWS)");
  assert.strictEqual(cert.verificationTier, "verified-high");
  assert.ok(cert.skills.includes("AWS"));
});

// 7. LinkedIn Custom Certification Entry
await asyncTest("LinkedIn Integration: Adds and verifies custom certification details", async () => {
  const result = await fetchLinkedInCertifications({
    title: "Google Cloud Professional DevOps Engineer",
    issuer: "Google Cloud",
    credentialId: "GCP-DEV-99182",
  });

  assert.strictEqual(result.success, true);
  assert.strictEqual(result.certifications.length, 1);
  const cert = result.certifications[0];
  assert.strictEqual(cert.title, "Google Cloud Professional DevOps Engineer");
  assert.strictEqual(cert.issuer, "Google Cloud");
  assert.strictEqual(cert.credentialId, "GCP-DEV-99182");
  assert.strictEqual(cert.verificationTier, "verified-high");
  assert.ok(cert.skills.includes("Google Cloud"));
});

// 8. QR Verifier & Crypto Hash
test("QR Verifier: Validates Coursera credential URLs into verified-high tier", () => {
  const result = verifyQrPayload("https://coursera.org/verify/specialization/DL-88204-VERIFIED");
  assert.strictEqual(result.isVerified, true);
  assert.strictEqual(result.tier, "verified-high");
  assert.strictEqual(result.issuer, "Coursera Credential Registry");
});

test("Cryptographic Hash: Generates deterministic SHA-256 evidence digest", () => {
  const hash = computeSha256("Deep Learning Specialization_https://coursera.org/verify/DL99201");
  assert.ok(hash.startsWith("sha256:"));
  assert.strictEqual(hash.length, 7 + 64);
});

import { parseCredlyInput, fetchCredlyBadges } from "../lib/integrations/credly.js";

// 10. Credly Parser & Badge Verification Tests
test("Credly Parser: Extracts badge ID and user handles accurately", () => {
  const parsedBadge = parseCredlyInput("https://www.credly.com/badges/abc-123-aws-cert");
  assert.strictEqual(parsedBadge.type, "badge_id");
  assert.strictEqual(parsedBadge.cleanId, "abc-123-aws-cert");

  const parsedUser = parseCredlyInput("https://www.credly.com/users/tonystark/badges");
  assert.strictEqual(parsedUser.type, "user_handle");
  assert.strictEqual(parsedUser.cleanId, "tonystark");
});

await asyncTest("Credly Integration: Verifies badge directly into verified-high tier", async () => {
  const result = await fetchCredlyBadges({
    badgeUrl: "https://www.credly.com/badges/aws-certified-solutions-architect-associate",
  });

  assert.strictEqual(result.success, true);
  assert.strictEqual(result.badges.length, 1);
  const badge = result.badges[0];
  assert.strictEqual(badge.issuer, "Amazon Web Services (AWS)");
  assert.strictEqual(badge.verificationTier, "verified-high");
  assert.ok(badge.skills.includes("AWS"));
});

await asyncTest("Credly Integration: Empty input returns clean prompt without fake suggestions", async () => {
  const result = await fetchCredlyBadges({
    badgeUrl: "",
    credlyUrl: "",
  });

  assert.strictEqual(result.success, true);
  assert.strictEqual(result.badges.length, 0);
  assert.ok(result.message);
});

await asyncTest("Credly Integration: Inaccessible or private profile triggers private indicator", async () => {
  const result = await fetchCredlyBadges({
    credlyUrl: "https://www.credly.com/users/non-existent-user-xyz-99182/badges",
  });

  assert.strictEqual(result.success, false);
  assert.ok(result.isPrivate || result.error);
  assert.strictEqual(result.badges.length, 0);
});

console.log("\n------------------------------------------------------------");
console.log(`Results: ${passed} / ${total} tests passed (${Math.round((passed / total) * 100)}%)`);
console.log("------------------------------------------------------------\n");

if (passed !== total) {
  process.exit(1);
}
