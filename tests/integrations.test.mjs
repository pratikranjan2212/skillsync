import assert from "node:assert";
import { parseCourseraInput, fetchCourseraCertificates, searchCourseraCatalog, extractSkillsFromText } from "../lib/integrations/coursera.js";
import { extractLinkedInUsername, fetchLinkedInCertifications, extractOAuthAvatar } from "../lib/integrations/linkedin.js";
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

// 5. LinkedIn Username Extraction
test("LinkedIn Parser: Extracts username from various LinkedIn URL formats", () => {
  assert.strictEqual(extractLinkedInUsername("https://www.linkedin.com/in/pratikranjan/"), "pratikranjan");
  assert.strictEqual(extractLinkedInUsername("https://linkedin.com/in/tonystark?utm_source=share"), "tonystark");
  assert.strictEqual(extractLinkedInUsername("peterparker"), "peterparker");
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

// 9. OAuth Profile Photo Extraction
test("OAuth Photo Extractor: Extracts LinkedIn OpenID Connect picture", () => {
  const oidcProfile = {
    sub: "123456",
    name: "Tony Stark",
    picture: "https://media.licdn.com/dms/image/v2/D5603AQF/profile-displayphoto-shrink_800_800/0/stark.jpg",
  };
  const photo = extractOAuthAvatar(oidcProfile);
  assert.strictEqual(photo, "https://media.licdn.com/dms/image/v2/D5603AQF/profile-displayphoto-shrink_800_800/0/stark.jpg");
});

test("OAuth Photo Extractor: Extracts GitHub avatar_url and user object override", () => {
  const ghProfile = {
    login: "tonystark",
    avatar_url: "https://avatars.githubusercontent.com/u/101?v=4",
  };
  assert.strictEqual(extractOAuthAvatar(ghProfile), "https://avatars.githubusercontent.com/u/101?v=4");

  const existingUser = { image: "https://custom-domain.com/photo.png" };
  assert.strictEqual(extractOAuthAvatar(ghProfile, existingUser), "https://custom-domain.com/photo.png");
});

console.log("\n------------------------------------------------------------");
console.log(`Results: ${passed} / ${total} tests passed (${Math.round((passed / total) * 100)}%)`);
console.log("------------------------------------------------------------\n");

if (passed !== total) {
  process.exit(1);
}
