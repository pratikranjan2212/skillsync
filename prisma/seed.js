import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting SkillSync database seed...");

  // 1. Create Demo Users
  const studentPasswordHash = await bcrypt.hash("student123", 10);
  const adminPasswordHash = await bcrypt.hash("admin123", 10);

  const studentUser = await prisma.user.upsert({
    where: { email: "alex.chen@skillsync.edu" },
    update: {},
    create: {
      name: "Alex Chen",
      email: "alex.chen@skillsync.edu",
      passwordHash: studentPasswordHash,
      role: "student",
      college: "Ramaiah Institute of Technology",
      degree: "B.Tech in Computer Science & Engineering",
      batch: "2022 – 2026",
    },
  });

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@skillsync.edu" },
    update: {},
    create: {
      name: "Admin Lead",
      email: "admin@skillsync.edu",
      passwordHash: adminPasswordHash,
      role: "admin",
    },
  });

  console.log(`✅ Users created: Student (${studentUser.id}), Admin (${adminUser.id})`);

  // 2. Create Student Passport
  await prisma.passport.upsert({
    where: { userId: studentUser.id },
    update: {},
    create: {
      userId: studentUser.id,
      studentId: "SS-2024-7F8A2B",
      isPublic: true,
      shareToken: "sp-token-9942a",
      credentialHash: "0x7F8A2B9942ACD081884C7D659A2FEAA015A3BF4F",
      issuer: "SkillSync Verifiable Credential Engine",
    },
  });

  // 3. Seed Skill Taxonomy
  const taxonomy = [
    { name: "Python", category: "Programming Languages", description: "Core syntax, data structures, and standard libraries." },
    { name: "SQL", category: "Databases", description: "Relational database querying, joins, and indexing." },
    { name: "React.js", category: "Frontend Web", description: "Modern React with hooks, state management, and component architecture." },
    { name: "TensorFlow", category: "AI & Machine Learning", description: "Deep learning models, tensor manipulation, and training loops." },
    { name: "Docker", category: "DevOps & Cloud", description: "Containerization, Dockerfiles, and multi-stage builds." },
    { name: "REST API design", category: "Backend Engineering", description: "HTTP endpoints, JSON payloads, and API authentication." },
    { name: "Tailwind CSS", category: "Frontend Web", description: "Utility-first CSS styling and responsive layout design." },
    { name: "Data Engineering", category: "Data Science", description: "ETL pipelines, data cleaning, and processing." },
    { name: "Node.js", category: "Backend Engineering", description: "Server-side JavaScript runtime, event loop, and asynchronous I/O." },
    { name: "PostgreSQL", category: "Databases", description: "Advanced relational database with ACID compliance and indexing." },
    { name: "Git", category: "Developer Tools", description: "Version control, branching strategies, and commit hygiene." },
    { name: "Next.js", category: "Full-Stack Web", description: "React framework with App Router, SSR, and API routes." },
  ];

  for (const skill of taxonomy) {
    await prisma.skill.upsert({
      where: { name: skill.name },
      update: {},
      create: skill,
    });
  }

  // 4. Seed Verified Evidence for Student
  const initialEvidence = [
    {
      userId: studentUser.id,
      type: "project",
      title: "Data Pipeline Project",
      description: "Built scalable ETL pipeline processing 1M+ daily records using Python, Pandas, and AWS S3.",
      fileUrl: "https://github.com/student/data-pipeline-demo",
      fileHash: "sha256:9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
      verificationTier: "verified-high",
      verificationReason: "QR-confirmed repository commit hash and verified institutional signature",
      verificationStage: "completed",
      verifiedAt: new Date("2026-08-10T14:30:00Z"),
      adminOverride: false,
      claimedSkills: ["Python", "Data Engineering", "SQL"],
    },
    {
      userId: studentUser.id,
      type: "coursework",
      title: "DBMS Coursework & Lab Grade (92%)",
      description: "Completed Advanced Database Systems course covering query optimization, indexing, and relational schemas.",
      fileUrl: "https://university.edu/transcripts/verify?id=99201",
      fileHash: "sha256:a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0",
      verificationTier: "verified-medium",
      verificationReason: "OCR-parsed grade report matching university domain header",
      verificationStage: "completed",
      verifiedAt: new Date("2026-08-11T09:15:00Z"),
      adminOverride: false,
      claimedSkills: ["SQL", "Relational Databases"],
    },
    {
      userId: studentUser.id,
      type: "micro-credential",
      title: "Deep Learning Specialization - Coursera",
      description: "5-course series covering Neural Networks, Convolutional Networks, and Sequence Models.",
      fileUrl: "https://coursera.org/verify/specialization/DL99201",
      fileHash: "sha256:7c8b9a0f1e2d3c4b5a697887960514233445566778899aabbccddeeff0011223",
      verificationTier: "verified-high",
      verificationReason: "Automated API verification with Coursera credential registry",
      verificationStage: "completed",
      verifiedAt: new Date("2026-08-12T16:45:00Z"),
      adminOverride: false,
      claimedSkills: ["Python", "TensorFlow", "Deep Learning"],
    },
    {
      userId: studentUser.id,
      type: "competition",
      title: "Hackathon 2026 - 2nd Place Winner",
      description: "Built automated skill extraction app using React and Tailwind CSS in 48 hours.",
      fileUrl: "https://devpost.com/software/skillsync-prototype",
      fileHash: "sha256:11223344556677889900aabbccddeeff11223344556677889900aabbccddeeff",
      verificationTier: "flagged-low",
      verificationReason: "Self-submitted link without digital signature or institutional co-signer",
      verificationStage: "flagged_review",
      verifiedAt: new Date("2026-08-13T11:00:00Z"),
      adminOverride: false,
      claimedSkills: ["React.js", "Tailwind CSS"],
    },
  ];

  for (const ev of initialEvidence) {
    await prisma.evidence.create({ data: ev });
  }

  // 5. Seed Opportunities
  const sampleOpportunities = [
    {
      externalId: "job-remotive-001",
      title: "Junior Data Engineer",
      company: "CloudScale Systems",
      location: "Bengaluru (Hybrid)",
      stipend: "₹45,000 / month",
      type: "Internship",
      description: "Looking for an aspiring Data Engineer skilled in Python, SQL, and ETL pipelines to build automated analytics infrastructure.",
      requiredSkills: ["Python", "SQL", "Data Engineering", "Docker"],
      source: "Direct",
      url: "https://cloudscale.io/careers/junior-data-engineer",
    },
    {
      externalId: "job-remotive-002",
      title: "AI / ML Research Intern",
      company: "NeuralMatrix Labs",
      location: "Remote (India)",
      stipend: "₹55,000 / month",
      type: "Internship",
      description: "Join our computer vision and NLP lab to train and deploy deep learning models using TensorFlow and PyTorch.",
      requiredSkills: ["Python", "TensorFlow", "Deep Learning", "REST API design"],
      source: "Direct",
      url: "https://neuralmatrix.ai/jobs/ml-intern",
    },
    {
      externalId: "job-remotive-003",
      title: "Full-Stack React & Next.js Developer",
      company: "VentureCraft Studio",
      location: "Mumbai (On-site)",
      stipend: "₹40,000 / month",
      type: "Internship",
      description: "Build user-facing web applications, responsive dashboards, and interactive UI systems using Next.js, React, and Tailwind CSS.",
      requiredSkills: ["React.js", "Tailwind CSS", "REST API design", "Docker"],
      source: "Direct",
      url: "https://venturecraft.dev/apply",
    },
  ];

  for (const opp of sampleOpportunities) {
    await prisma.opportunity.upsert({
      where: { externalId: opp.externalId },
      update: {},
      create: opp,
    });
  }

  // 6. Seed Fairness Audit
  await prisma.fairnessAudit.create({
    data: {
      excludedParameters: ["gender", "college tier", "name", "photo"],
      sampleSize: 1240,
      parityScore: 0.998,
      notes: "Demographic parity audit completed with zero disparate impact across college tiers and gender categories.",
    },
  });

  console.log("✨ SkillSync database seed completed successfully.");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
