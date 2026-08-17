/**
 * Comprehensive Unit Test Suite for SkillSync Job Match Score Engine.
 * Tests realistic industry scenarios, edge cases, semantic matching, false positive prevention, and determinism.
 */

import assert from "node:assert";
import { getMatchingFeatures } from "../lib/matching/getMatchingFeatures.js";
import { calculateMatchScore } from "../lib/matching/scoring.js";
import { buildExplainableMatch } from "../lib/matching/explainability.js";
import { parseJobRequirements } from "../lib/matching/jobParser.js";
import { normalizeSkillKey, areStrictlyIncompatible } from "../lib/matching/taxonomy.js";

console.log("------------------------------------------------------------");
console.log("Running SkillSync Job Match Score Engine Unit Tests");
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
    console.error(err.message);
    console.error(err.stack);
  }
}

// ----------------------------------------------------------------------------
// Test Suite
// ----------------------------------------------------------------------------

test("Case 1 — Excellent match: User has core tech stack & supporting tools", () => {
  const user = { skills: ["Python", "Django", "SQL", "REST API", "Git"] };
  const features = getMatchingFeatures(user, [
    { claimedSkills: ["Python", "Django"], verificationTier: "verified-high", title: "Web App" },
    { claimedSkills: ["SQL", "REST API"], verificationTier: "verified-high", title: "API Backend" },
  ]);

  const job = {
    title: "Junior Python Django Developer",
    description: "Required: Python, Django, SQL, REST API. Preferred: Git, Docker. Experience: 0-2 years.",
    requiredSkills: ["Python", "Django", "SQL", "REST API design"],
    type: "Internship",
  };

  const result = calculateMatchScore(features, job);

  assert(result.score >= 88, `Expected score >= 88, got ${result.score}`);
  assert(result.label === "Excellent Match" || result.label === "Strong Match", `Expected top tier label, got ${result.label}`);
  assert.strictEqual(result.matchedRequired.length >= 3, true, "Should match at least 3 required skills directly");
  assert.strictEqual(result.missingRequired.length, 0, "Should have zero missing required skills");
});

test("Case 2 — Wrong technology stack: Python/Django user vs Java/Spring role", () => {
  const user = { skills: ["Python", "Django", "SQL"] };
  const features = getMatchingFeatures(user, []);

  const job = {
    title: "Java Spring Boot Developer",
    description: "Required: Java, Spring Boot, Hibernate, Kafka, AWS. Experience: 2-4 years.",
    requiredSkills: ["Java", "Spring Boot", "Hibernate", "Kafka", "AWS"],
    type: "Full-time",
  };

  const result = calculateMatchScore(features, job);

  assert(result.score <= 35, `Expected score <= 35 for mismatched stack, got ${result.score}`);
  assert.strictEqual(result.label, "Weak Match", `Expected 'Weak Match', got '${result.label}'`);
  assert(result.missingRequired.length >= 4, "Should list major Java stack requirements as missing");
});

test("Case 3 — Partial match: Core skills present, missing secondary tools", () => {
  const user = { skills: ["Python", "Django"] };
  const features = getMatchingFeatures(user, []);

  const job = {
    title: "Python Django Backend Engineer",
    description: "Looking for Python Django developer with PostgreSQL, Docker, and AWS experience.",
    requiredSkills: ["Python", "Django", "PostgreSQL", "Docker", "AWS"],
    type: "Full-time",
  };

  const result = calculateMatchScore(features, job);

  assert(result.score >= 45 && result.score <= 75, `Expected score between 45 and 75, got ${result.score}`);
  assert(result.matchedRequired.some((m) => m.canonical === "python"), "Python should be matched");
  assert(result.matchedRequired.some((m) => m.canonical === "django"), "Django should be matched");
  assert(result.missingRequired.some((m) => m.canonical === "docker"), "Docker should be missing");
  assert(result.missingRequired.some((m) => m.canonical === "aws"), "AWS should be missing");
});

test("Case 4 — Semantic / Related skill: PostgreSQL satisfies SQL requirement with partial credit", () => {
  const user = { skills: ["PostgreSQL"] };
  const features = getMatchingFeatures(user, []);

  const job = {
    title: "Database Analyst",
    description: "Requirements: SQL",
    requiredSkills: ["SQL"],
  };

  const result = calculateMatchScore(features, job);

  assert(result.score >= 60, `Expected score >= 60 with related skill credit, got ${result.score}`);
  assert.strictEqual(result.relatedSkills.length, 1, "PostgreSQL should be identified as a related skill");
  assert.strictEqual(result.relatedSkills[0].sourceSkill, "PostgreSQL");
  assert(result.relatedSkills[0].weight >= 0.8, "Should receive ~0.85 relation weight");
});

test("Case 5 — False-positive prevention: JavaScript != Java", () => {
  assert.strictEqual(areStrictlyIncompatible("javascript", "java"), true, "JavaScript and Java must be strictly incompatible");
  assert.strictEqual(areStrictlyIncompatible("c", "c++"), true, "C and C++ must be strictly incompatible");
  assert.strictEqual(areStrictlyIncompatible("react", "react native"), true, "React and React Native must be strictly incompatible");
  assert.strictEqual(areStrictlyIncompatible("aws", "azure"), true, "AWS and Azure must be strictly incompatible");

  const user = { skills: ["JavaScript"] };
  const features = getMatchingFeatures(user, []);

  const job = {
    title: "Java Developer",
    description: "Requirements: Java",
    requiredSkills: ["Java"],
  };

  const result = calculateMatchScore(features, job);

  assert(result.score <= 25, `Expected score <= 25 for JS vs Java, got ${result.score}`);
  assert.strictEqual(result.matchedRequired.length, 0, "JavaScript must NOT match Java");
  assert.strictEqual(result.relatedSkills.length, 0, "JavaScript must NOT be related to Java");
});

test("Case 6 — Fresher compatibility: Student user vs 0-2 yrs Junior listing", () => {
  const user = { skills: ["Python", "Django", "SQL"] };
  const features = getMatchingFeatures(user, []); // candidateExperienceYears = 0

  const job = {
    title: "Junior Python Developer",
    description: "Ideal for freshers and recent graduates. Experience: 0-2 years. Requirements: Python, Django, SQL.",
    requiredSkills: ["Python", "Django", "SQL"],
    type: "Internship",
  };

  const result = calculateMatchScore(features, job);

  assert.strictEqual(result.subScores.experienceScore, 100, "Fresher experience score should be 100%");
  assert(result.score >= 88, `Expected score >= 88, got ${result.score}`);
});

test("Case 7 — Senior position penalty: Student user vs 5+ yrs Senior listing", () => {
  const user = { skills: ["Python", "Django"] };
  const features = getMatchingFeatures(user, []); // candidateExperienceYears = 0

  const job = {
    title: "Senior Python Architect",
    description: "Minimum 5+ years of production experience required. Senior lead role.",
    requiredSkills: ["Python", "Django"],
    type: "Full-time",
  };

  const result = calculateMatchScore(features, job);

  assert.strictEqual(result.subScores.experienceScore <= 30, true, "Experience score should be heavily penalized for 5+ yr requirement");
  assert(result.score < 80, `Senior role score for fresher should be lower, got ${result.score}`);
});

test("Case 8 — Keyword inflation avoidance: Repeating words does NOT multiply score", () => {
  const user = { skills: ["Python"] };
  const features = getMatchingFeatures(user, []);

  // Job mentions Python multiple times in description, but requires 10 different skills
  const job = {
    title: "Full Stack Engineer",
    description: "Python Python Python Python developer needed. Must also know Java, AWS, Docker, Kubernetes, Kafka, React, SQL, Git, Jenkins.",
    requiredSkills: ["Python", "Java", "AWS", "Docker", "Kubernetes", "Kafka", "React", "SQL", "Git", "Jenkins"],
  };

  const result = calculateMatchScore(features, job);

  // Single skill out of 10 should yield a low/partial score, not inflated by repeated "Python"
  assert(result.score <= 35, `Score should reflect 1/10 coverage (~25-35%), got ${result.score}`);
  assert.strictEqual(result.matchedRequired.length, 1, "Python should be counted exactly once");
});

test("Case 9 — Confidence score calculation: Rich data vs Sparse data", () => {
  const richJob = {
    title: "Python Backend Developer Intern",
    company: "Acme Corp",
    location: "Bengaluru, KA",
    stipend: "₹45,000 / month",
    description: "Detailed job description explaining requirements, daily responsibilities, and team structure in depth. Required: Python, SQL, REST API. Preferred: Docker.",
    requiredSkills: ["Python", "SQL", "REST API design"],
  };
  const parsedRich = parseJobRequirements(richJob);
  assert.strictEqual(parsedRich.confidence, "high", "Detailed job should receive 'high' confidence");

  const sparseJob = {
    title: "Dev",
    company: "Unknown",
    description: "Short",
    requiredSkills: [],
  };
  const parsedSparse = parseJobRequirements(sparseJob);
  assert.strictEqual(parsedSparse.confidence, "low", "Sparse job should receive 'low' confidence");
});

test("Case 10 — Determinism & Zero Demographic Bias", () => {
  const userA = {
    name: "Alex Smith",
    gender: "Female",
    college: "Tier 1 University",
    skills: ["React", "TypeScript", "Tailwind CSS"],
  };
  const userB = {
    name: "John Doe",
    gender: "Male",
    college: "Rural College",
    skills: ["React", "TypeScript", "Tailwind CSS"],
  };

  const featuresA = getMatchingFeatures(userA, []);
  const featuresB = getMatchingFeatures(userB, []);

  const job = {
    title: "Frontend Developer Intern",
    requiredSkills: ["React", "TypeScript", "Tailwind CSS"],
  };

  const resultA = calculateMatchScore(featuresA, job);
  const resultB = calculateMatchScore(featuresB, job);

  assert.strictEqual(resultA.score, resultB.score, "Scores must be identical regardless of gender, college, or name");
  assert.strictEqual(resultA.subScores.requiredSkillScore, resultB.subScores.requiredSkillScore);
  assert.strictEqual(resultA.subScores.titleScore, resultB.subScores.titleScore);
  assert.strictEqual(resultA.subScores.experienceScore, resultB.subScores.experienceScore);
});

test("Case 11 — Canonical Alias Normalization", () => {
  assert.strictEqual(normalizeSkillKey("Python 3"), "python");
  assert.strictEqual(normalizeSkillKey("python programming language"), "python");
  assert.strictEqual(normalizeSkillKey("JS"), "javascript");
  assert.strictEqual(normalizeSkillKey("vanilla js"), "javascript");
  assert.strictEqual(normalizeSkillKey("TS"), "typescript");
  assert.strictEqual(normalizeSkillKey("Postgres"), "postgresql");
  assert.strictEqual(normalizeSkillKey("ReactJS"), "react");
  assert.strictEqual(normalizeSkillKey("Node.js"), "node.js");
  assert.strictEqual(normalizeSkillKey("DRF"), "django rest framework");
  assert.strictEqual(normalizeSkillKey("Django REST Framework"), "django rest framework");
});

test("Case 12 — Explainable Breakdown generation", () => {
  const user = { skills: ["Python", "Django", "PostgreSQL"] };
  const evidence = [
    { claimedSkills: ["Python", "Django"], verificationTier: "verified-high", title: "Production E-commerce Site" },
  ];

  const job = {
    id: "test-opp-123",
    title: "Python Web Developer",
    company: "ScaleTech",
    requiredSkills: ["Python", "Django", "SQL"],
    description: "Required: Python, Django, SQL. Preferred: Docker.",
  };

  const explanation = buildExplainableMatch(job, user, evidence);
  // console.log("Case 12 explanation:", JSON.stringify(explanation, null, 2));
  assert.strictEqual(explanation.matchScore >= 80, true, `Score should be strong, got ${explanation.matchScore}`);
  assert.strictEqual(explanation.citations.length >= 2, true, `Expected citations >= 2, got ${explanation.citations?.length}`);
  assert.strictEqual(explanation.supportingEvidence.length >= 2, true);
  assert.strictEqual(explanation.relatedEvidence.length >= 1, true, "PostgreSQL should be in related evidence for SQL");
  assert.strictEqual(explanation.fairnessGuarantee.zeroBiasCertified, true);
});

console.log("\n------------------------------------------------------------");
console.log(`Results: ${passed} / ${total} tests passed (${Math.round((passed / total) * 100)}%)`);
console.log("------------------------------------------------------------\n");

if (passed !== total) {
  process.exit(1);
}
