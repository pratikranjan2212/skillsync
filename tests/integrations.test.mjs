import assert from "node:assert";
import { parseCredlyInput, fetchCredlyBadges, extractSkillsFromText } from "../lib/integrations/credly.js";
import {
  extractLinkedInUsername,
  extractGitHubUsername,
  fetchLinkedInCertifications,
  extractOAuthAvatar,
} from "../lib/integrations/linkedin.js";
import { verifyQrPayload } from "../lib/verification/qrVerifier.js";
import { computeSha256 } from "../lib/verification/cryptoHash.js";
import {
  formatStipend,
  deduplicateOpportunities,
  validateAndNormalizeOpportunity,
  getOpportunityWorkMode,
  formatDob,
} from "../lib/opportunities/workModeUtils.js";
import { normalizeUrlForComparison } from "../lib/security/validator.js";

console.log("------------------------------------------------------------");
console.log("Running SkillSync Credly, LinkedIn & Integrations Unit Tests");
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

// 1. Skill Keyword Extraction
test("Skill Extractor: Extracts technical competencies from metadata and descriptions", () => {
  const skills = extractSkillsFromText("AWS Certified Solutions Architect Associate with Python and Docker");
  assert.ok(skills.includes("AWS"));
  assert.ok(skills.includes("Python"));
  assert.ok(skills.includes("Docker"));
});

// 2. LinkedIn & GitHub Username Extraction
test("LinkedIn Parser: Extracts username from various LinkedIn URL formats & handles", () => {
  assert.strictEqual(extractLinkedInUsername("https://www.linkedin.com/in/pratikranjan/"), "pratikranjan");
  assert.strictEqual(extractLinkedInUsername("https://linkedin.com/in/tonystark?utm_source=share"), "tonystark");
  assert.strictEqual(extractLinkedInUsername("in/alexchen"), "alexchen");
  assert.strictEqual(extractLinkedInUsername("peterparker"), "peterparker");
  assert.strictEqual(extractLinkedInUsername(""), null);
});

test("GitHub Parser: Extracts username from various GitHub URL formats & handles", () => {
  assert.strictEqual(extractGitHubUsername("https://github.com/pratikranjan2212"), "pratikranjan2212");
  assert.strictEqual(extractGitHubUsername("https://github.com/torvalds/"), "torvalds");
  assert.strictEqual(extractGitHubUsername("@octocat"), "octocat");
  assert.strictEqual(extractGitHubUsername("ananya-sharma"), "ananya-sharma");
  assert.strictEqual(extractGitHubUsername(""), null);
});

// 3. LinkedIn Credly Badge Verification
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

// 4. LinkedIn Custom Certification Entry
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

await asyncTest("LinkedIn Integration: Preserves custom issuer and tags relevant tech skills", async () => {
  const result = await fetchLinkedInCertifications({
    title: "Certified Kubernetes Administrator (CKA)",
    issuer: "The Linux Foundation",
    credentialId: "CKA-9918201",
    verificationUrl: "https://www.cncf.io/certification/cka/",
  });

  assert.strictEqual(result.success, true);
  assert.strictEqual(result.certifications.length, 1);
  const cert = result.certifications[0];
  assert.strictEqual(cert.title, "Certified Kubernetes Administrator (CKA)");
  assert.strictEqual(cert.issuer, "The Linux Foundation");
  assert.strictEqual(cert.credentialId, "CKA-9918201");
  assert.strictEqual(cert.verificationTier, "verified-high");
  assert.ok(cert.skills.includes("Kubernetes") || cert.skills.includes("Docker") || cert.skills.includes("Linux"));
});

// 5. Credly Parser & Badge Verification Tests
test("Credly Parser: Extracts badge ID and user handles accurately", () => {
  const parsedBadge = parseCredlyInput("https://www.credly.com/badges/abc-123-aws-cert");
  assert.strictEqual(parsedBadge.type, "badge_id");
  assert.strictEqual(parsedBadge.cleanId, "abc-123-aws-cert");

  const parsedUser = parseCredlyInput("https://www.credly.com/users/tonystark/badges");
  assert.strictEqual(parsedUser.type, "user_handle");
  assert.strictEqual(parsedUser.cleanId, "tonystark");

  const parsedShort = parseCredlyInput("https://credly.com/u/pratik-ranjan");
  assert.strictEqual(parsedShort.type, "user_handle");
  assert.strictEqual(parsedShort.cleanId, "pratik-ranjan");
});

await asyncTest("Credly Integration: Verifies AWS badge directly into verified-high tier", async () => {
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

await asyncTest("Credly Integration: Verifies Azure and GCP badges directly", async () => {
  const azureResult = await fetchCredlyBadges({
    badgeUrl: "https://www.credly.com/badges/microsoft-certified-azure-fundamentals",
  });
  assert.strictEqual(azureResult.success, true);
  assert.strictEqual(azureResult.badges[0].issuer, "Microsoft");
  assert.ok(azureResult.badges[0].skills.includes("Microsoft Azure"));

  const gcpResult = await fetchCredlyBadges({
    badgeUrl: "https://www.credly.com/badges/google-cloud-certified-associate-cloud-engineer",
  });
  assert.strictEqual(gcpResult.success, true);
  assert.strictEqual(gcpResult.badges[0].issuer, "Google Cloud");
  assert.ok(gcpResult.badges[0].skills.includes("Google Cloud"));
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

// 6. QR Verifier & Crypto Hash
test("QR Verifier: Validates Credly digital badge URLs into verified-high tier", () => {
  const result = verifyQrPayload("https://www.credly.com/badges/aws-solutions-architect");
  assert.strictEqual(result.isVerified, true);
  assert.strictEqual(result.tier, "verified-high");
  assert.strictEqual(result.issuer, "Credly / Accredible Digital Badging");
});

test("QR Verifier: Validates university academic credential URLs into verified-high tier", () => {
  const result = verifyQrPayload("https://registrar.stanford.edu/verify/transcript/99812");
  assert.strictEqual(result.isVerified, true);
  assert.strictEqual(result.tier, "verified-high");
  assert.strictEqual(result.issuer, "Accredited University Transcript Portal");
});

test("Cryptographic Hash: Generates deterministic SHA-256 evidence digest", () => {
  const hash = computeSha256("AWS Solutions Architect_https://credly.com/badges/aws-123");
  assert.ok(hash.startsWith("sha256:"));
  assert.strictEqual(hash.length, 7 + 64);
});

// 7. Opportunity Salary Standardization & Deduplication Tests
test("Salary Formatter: Standardizes diverse compensation formats into clean strings", () => {
  assert.strictEqual(formatStipend("₹15,000 a month"), "₹15,000 / month");
  assert.strictEqual(formatStipend("From ₹25,000 per month"), "From ₹25,000 / month");
  assert.strictEqual(formatStipend("45000 / month"), "₹45000 / month");
  assert.strictEqual(formatStipend(60000), "₹60,000 / month");
  assert.strictEqual(formatStipend(750000), "₹7,50,000 / yr");
  assert.strictEqual(formatStipend("$60,000 a year"), "$60,000 / yr");
  
  // Market benchmark fallbacks for empty / unlisted values
  assert.strictEqual(formatStipend(null, "AI Research Intern", "Internship"), "₹55,000 – ₹75,000 / month");
  assert.strictEqual(formatStipend(undefined, "Data Engineer Intern", "Internship"), "₹50,000 – ₹65,000 / month");
  assert.strictEqual(formatStipend("", "Frontend Developer Intern", "Internship"), "₹40,000 – ₹55,000 / month");
  assert.strictEqual(formatStipend("Not Listed", "Junior Software Engineer", "Full-time Role"), "₹6,00,000 – ₹8,50,000 / yr");
});

test("Opportunity Deduplication: Eliminates duplicates with variations in IDs, URLs and company suffixes", () => {
  const sampleList = [
    {
      id: "job-1",
      externalId: "ext-1",
      title: "Full-Stack Developer Intern",
      company: "Vercel Labs",
      url: "https://linkedin.com/jobs/view/12345678?trackingId=xyz",
    },
    {
      id: "job-2",
      externalId: "ext-2",
      title: "Full Stack Developer Intern",
      company: "Vercel Inc",
      url: "https://linkedin.com/jobs/view/12345678?utm_source=feed",
    },
    {
      id: "job-3",
      externalId: "ext-3",
      title: "AI Research Scientist",
      company: "Scale AI",
      url: "https://indeed.com/jobs/view/99988877",
    },
    {
      id: "job-1", // duplicate by ID
      title: "Full-Stack Developer Intern",
      company: "Vercel Labs",
    },
  ];

  const deduped = deduplicateOpportunities(sampleList);
  assert.strictEqual(deduped.length, 2, "Should deduplicate down to 2 unique jobs (Vercel and Scale AI)");
  assert.strictEqual(deduped[0].id, "job-1");
  assert.strictEqual(deduped[1].id, "job-3");
});

test("Opportunity Validator: Ensures complete data integrity, workMode and clean skills", () => {
  const malformed = {
    title: "React &amp; Next.js Intern",
    company: "Razorpay Core &amp; Co",
    location: "Bengaluru, KA (Hybrid)",
    workMode: null,
    stipend: null,
    requiredSkills: ["React", "&lt;Python&gt;", ""],
  };

  const normalized = validateAndNormalizeOpportunity(malformed);
  assert.strictEqual(normalized.title, "React & Next.js Intern");
  assert.strictEqual(normalized.company, "Razorpay Core & Co");
  assert.strictEqual(normalized.workMode, "Hybrid");
  assert.ok(normalized.stipend.includes("₹"));
  assert.strictEqual(normalized.source, "LinkedIn");
  assert.ok(normalized.url.includes("linkedin.com"));
});

test("DOB Formatter: Formats full month names and date formats to short 3-letter months", () => {
  assert.strictEqual(formatDob("18 January 2005"), "18 Jan 2005");
  assert.strictEqual(formatDob("22 December 2005"), "22 Dec 2005");
  assert.strictEqual(formatDob("12 May 2003"), "12 May 2003");
  assert.strictEqual(formatDob("2005-01-18"), "18 Jan 2005");
  assert.strictEqual(formatDob("2004-11-05"), "5 Nov 2004");
  assert.strictEqual(formatDob("18/01/2005"), "18 Jan 2005");
  assert.strictEqual(formatDob("February 28, 2002"), "28 Feb 2002");
  assert.strictEqual(formatDob("August 15 2001"), "15 Aug 2001");
  assert.strictEqual(formatDob(""), "Not Specified");
  assert.strictEqual(formatDob(null), "Not Specified");
  assert.strictEqual(formatDob("Not Specified"), "Not Specified");
});

await asyncTest("LinkedIn Integration: Extracts certifications from pasted text with AI/fallback", async () => {
  const sampleText = `Licenses & certifications
AWS Cloud Practitioner Essentials
Amazon Web Services
Issued Aug 2026
Credential ID AWS-12345
Skills: AWS, Cloud Computing

Google AI Professional Certificate
Google
Issued Feb 2024
Credential ID GCP-9988
Skills: Python, TensorFlow, Machine Learning`;

  const result = await fetchLinkedInCertifications({ text: sampleText });
  assert.strictEqual(result.success, true);
  assert.strictEqual(result.certifications.length, 2);
  
  const awsCert = result.certifications.find(c => c.title.includes("Cloud Practitioner"));
  assert.ok(awsCert, "Should extract AWS Cloud Practitioner Essentials");
  assert.strictEqual(awsCert.issueDate, "Aug 2026");
  assert.ok(awsCert.issuer.includes("Amazon") || awsCert.issuer.includes("AWS"));

  const googleCert = result.certifications.find(c => c.title.includes("Google AI"));
  assert.ok(googleCert, "Should extract Google AI Professional Certificate");
  assert.strictEqual(googleCert.issueDate, "Feb 2024");
  assert.ok(googleCert.issuer.includes("Google"));
});

await asyncTest("LinkedIn Integration: Recognizes Coursera, Udemy, and HackerRank links", async () => {
  const courseraRes = await fetchLinkedInCertifications({
    verificationUrl: "https://coursera.org/verify/specialization/ABCXYZ123",
  });
  assert.strictEqual(courseraRes.success, true);
  assert.strictEqual(courseraRes.certifications[0].issuer, "Coursera");
  assert.ok(courseraRes.certifications[0].isVerified);

  const udemyRes = await fetchLinkedInCertifications({
    verificationUrl: "https://www.udemy.com/certificate/UC-123456789/",
  });
  assert.strictEqual(udemyRes.success, true);
  assert.strictEqual(udemyRes.certifications[0].issuer, "Udemy");
});

// 8. Evidence & Passport Project Deduplication Tests
test("URL Normalizer: Standardizes GitHub and evidence URLs across protocols, slashes, and .git", () => {
  const base = normalizeUrlForComparison("https://github.com/tonystark/jarvis-core");
  assert.strictEqual(base, "github.com/tonystark/jarvis-core");
  assert.strictEqual(normalizeUrlForComparison("http://github.com/tonystark/jarvis-core/"), base);
  assert.strictEqual(normalizeUrlForComparison("https://www.github.com/tonystark/jarvis-core.git"), base);
  assert.strictEqual(normalizeUrlForComparison("https://GITHUB.COM/TonyStark/Jarvis-Core/"), base);
  assert.strictEqual(normalizeUrlForComparison(""), "");
  assert.strictEqual(normalizeUrlForComparison(null), "");
});

test("Evidence Deduplication: Detects duplicate repository submissions and titles", () => {
  const existingEvidences = [
    {
      id: "ev-1",
      userId: "usr-1",
      type: "project",
      title: "Jarvis Core AI",
      fileUrl: "https://github.com/tonystark/jarvis-core",
      fileHash: "sha256:abc12345",
    },
    {
      id: "ev-2",
      userId: "usr-1",
      type: "coursework",
      title: "CS229 Machine Learning",
      fileUrl: "https://stanford.edu/verify/cs229",
      fileHash: "sha256:def67890",
    },
  ];

  // Helper simulating backend duplicate check
  const checkDuplicate = (url, title, type, hash) => {
    const normTargetUrl = normalizeUrlForComparison(url);
    const normTargetTitle = (title || "").trim().toLowerCase();

    const isDuplicateUrl = normTargetUrl && existingEvidences.some(
      (ev) => normalizeUrlForComparison(ev.fileUrl) === normTargetUrl
    );

    const isDuplicateTitle = existingEvidences.some(
      (ev) => (ev.title || "").trim().toLowerCase() === normTargetTitle && (ev.type === type || type === "project")
    );

    const isDuplicateHash = hash && existingEvidences.some((ev) => ev.fileHash === hash);

    return isDuplicateUrl || isDuplicateTitle || isDuplicateHash;
  };

  // Same repo URL with trailing slash -> duplicate
  assert.strictEqual(checkDuplicate("https://github.com/tonystark/jarvis-core/", "New Name", "project"), true);
  // Same repo URL with .git -> duplicate
  assert.strictEqual(checkDuplicate("https://www.github.com/tonystark/jarvis-core.git", "Another Name", "project"), true);
  // Same project title -> duplicate
  assert.strictEqual(checkDuplicate("https://github.com/tonystark/different-repo", "Jarvis Core AI", "project"), true);
  // Same file hash -> duplicate
  assert.strictEqual(checkDuplicate("https://other.org", "Different Title", "coursework", "sha256:abc12345"), true);
  // Brand new unique project -> not duplicate
  assert.strictEqual(checkDuplicate("https://github.com/tonystark/arc-reactor", "Arc Reactor Engine", "project", "sha256:unique999"), false);
});

test("Passport Aggregation: Deduplicates project records with matching URLs or titles", () => {
  const rawEvidences = [
    {
      id: "ev-1",
      type: "project",
      title: "EcoTrack Waste Platform",
      fileUrl: "https://github.com/student/ecotrack",
      claimedSkills: ["React", "Node.js"],
      verificationTier: "verified-high",
    },
    {
      id: "ev-2",
      type: "project",
      title: "EcoTrack Waste Platform",
      fileUrl: "https://github.com/student/ecotrack/",
      claimedSkills: ["React", "Node.js"],
      verificationTier: "verified-high",
    },
    {
      id: "ev-3",
      type: "project",
      title: "ShopNest eCommerce",
      fileUrl: "https://github.com/student/shopnest",
      claimedSkills: ["Next.js", "PostgreSQL"],
      verificationTier: "verified-medium",
    },
  ];

  const projects = [];
  const seenUrls = new Set();
  const seenTitles = new Set();

  for (const ev of rawEvidences) {
    const normUrl = normalizeUrlForComparison(ev.fileUrl);
    const normTitle = (ev.title || "").trim().toLowerCase();

    if ((normUrl && seenUrls.has(normUrl)) || (normTitle && seenTitles.has(normTitle))) {
      continue;
    }
    if (normUrl) seenUrls.add(normUrl);
    if (normTitle) seenTitles.add(normTitle);

    projects.push({
      id: ev.id,
      title: ev.title,
      githubUrl: ev.fileUrl,
      skills: ev.claimedSkills,
    });
  }

  assert.strictEqual(projects.length, 2);
  assert.strictEqual(projects[0].title, "EcoTrack Waste Platform");
  assert.strictEqual(projects[1].title, "ShopNest eCommerce");
});

// 9. Bulk Multimodal Certificate Extraction Tests
await asyncTest("Bulk Certificate Extractor: Parses multiple certificate documents in parallel", async () => {
  const { extractCertificatesFromFiles } = await import("../lib/integrations/geminiMultimodalExtractor.js");

  const sampleFiles = [
    {
      name: "aws_solutions_architect_associate.pdf",
      type: "application/pdf",
      base64: "dGVzdC1hd3MtY2VydA==",
    },
    {
      name: "google_cloud_associate_engineer.png",
      type: "image/png",
      base64: "dGVzdC1nY3AtY2VydA==",
    },
    {
      name: "deeplearning_ai_neural_networks.jpg",
      type: "image/jpeg",
      base64: "dGVzdC1kZWVwbGVhcm5pbmctY2VydA==",
    },
  ];

  const extracted = await extractCertificatesFromFiles(sampleFiles);
  assert.strictEqual(extracted.length, 3);

  const aws = extracted.find((c) => c.title.toLowerCase().includes("aws") || c.issuer.toLowerCase().includes("amazon"));
  assert.ok(aws, "Should extract AWS certificate");
  assert.ok(aws.skills.some((s) => s.includes("AWS") || s.includes("Cloud")));

  const gcp = extracted.find((c) => c.title.toLowerCase().includes("google") || c.issuer.toLowerCase().includes("google"));
  assert.ok(gcp, "Should extract GCP certificate");

  const dl = extracted.find((c) => c.issuer.toLowerCase().includes("deeplearning") || c.title.toLowerCase().includes("neural") || c.skills.includes("Deep Learning"));
  assert.ok(dl, "Should extract DeepLearning.AI certificate");
});

console.log("\n------------------------------------------------------------");
console.log(`Results: ${passed} / ${total} tests passed (${Math.round((passed / total) * 100)}%)`);
console.log("------------------------------------------------------------\n");

if (passed !== total) {
  process.exit(1);
}
