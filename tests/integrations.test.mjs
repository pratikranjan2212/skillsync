import assert from "node:assert";
import { parseCourseraInput, fetchCourseraCertificates, COURSERA_INSTITUTIONAL_CATALOG } from "../lib/integrations/coursera.js";
import { extractLinkedInUsername, fetchLinkedInCertifications, LINKEDIN_CERTIFICATIONS_REGISTRY, extractOAuthAvatar } from "../lib/integrations/linkedin.js";
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
  assert.strictEqual(parsed.value, "DL99201");

  const parsedSpec = parseCourseraInput("https://www.coursera.org/verify/specialization/ABC123XYZ");
  assert.strictEqual(parsedSpec.type, "certificate_id");
  assert.strictEqual(parsedSpec.value, "ABC123XYZ");
});

test("Coursera Parser: Extracts user handle from profile URL", () => {
  const parsed = parseCourseraInput("https://www.coursera.org/user/pratikranjan");
  assert.strictEqual(parsed.type, "user_handle");
  assert.strictEqual(parsed.value, "pratikranjan");
});

// 3. Coursera Certificates Fetching
await asyncTest("Coursera Integration: Fetches structured verified certificates", async () => {
  const result = await fetchCourseraCertificates({
    apiKey: "kwD4F3akVxOnblOGvEGtflISgvReNXBA5v3Ikvt5b7Dmc5oh",
    courseraUrl: "https://coursera.org/user/pratikranjan",
  });

  assert.strictEqual(result.success, true);
  assert.ok(Array.isArray(result.certificates), "certificates must be an array");
  assert.ok(result.certificates.length > 0, "must return certificates");

  const firstCert = result.certificates[0];
  assert.ok(firstCert.title, "certificate must have a title");
  assert.ok(firstCert.issuer, "certificate must have an issuer");
  assert.ok(firstCert.verificationUrl.includes("coursera.org/verify"), "must have valid coursera verification URL");
  assert.ok(Array.isArray(firstCert.skills) && firstCert.skills.length > 0, "must include skill taxonomy tags");
  assert.strictEqual(firstCert.verificationTier, "verified-high");
});

// 4. LinkedIn Username Extraction
test("LinkedIn Parser: Extracts username from various LinkedIn URL formats", () => {
  assert.strictEqual(extractLinkedInUsername("https://www.linkedin.com/in/pratikranjan/"), "pratikranjan");
  assert.strictEqual(extractLinkedInUsername("https://linkedin.com/in/tonystark?utm_source=share"), "tonystark");
  assert.strictEqual(extractLinkedInUsername("peterparker"), "peterparker");
});

// 5. LinkedIn Certifications Fetching
await asyncTest("LinkedIn Integration: Fetches structured industry certifications", async () => {
  const result = await fetchLinkedInCertifications({
    linkedinUrl: "https://linkedin.com/in/pratikranjan",
  });

  assert.strictEqual(result.success, true);
  assert.ok(Array.isArray(result.certifications), "certifications must be an array");
  assert.ok(result.certifications.length > 0, "must return certifications");

  const firstCert = result.certifications[0];
  assert.ok(firstCert.title, "certification must have a title");
  assert.ok(firstCert.issuer, "certification must have an issuer");
  assert.ok(firstCert.credentialId, "certification must have a credential ID");
  assert.ok(Array.isArray(firstCert.skills) && firstCert.skills.length > 0, "must include skill tags");
  assert.strictEqual(firstCert.verificationTier, "verified-high");
});

// 6. Verification Pipeline Recognition of Coursera Registry
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

// 7. OAuth Profile Photo Extraction
test("OAuth Photo Extractor: Extracts LinkedIn OpenID Connect picture", () => {
  const oidcProfile = {
    sub: "123456",
    name: "Tony Stark",
    picture: "https://media.licdn.com/dms/image/v2/D5603AQF/profile-displayphoto-shrink_800_800/0/stark.jpg",
  };
  const photo = extractOAuthAvatar(oidcProfile);
  assert.strictEqual(photo, "https://media.licdn.com/dms/image/v2/D5603AQF/profile-displayphoto-shrink_800_800/0/stark.jpg");
});

test("OAuth Photo Extractor: Extracts LinkedIn legacy/v2 nested displayImage structure", () => {
  const v2Profile = {
    sub: "998877",
    profilePicture: {
      "displayImage~": {
        elements: [
          { identifiers: [{ identifier: "https://media.licdn.com/dms/image/small.jpg" }] },
          { identifiers: [{ identifier: "https://media.licdn.com/dms/image/large.jpg" }] },
        ],
      },
    },
  };
  const photo = extractOAuthAvatar(v2Profile);
  assert.strictEqual(photo, "https://media.licdn.com/dms/image/large.jpg");
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
