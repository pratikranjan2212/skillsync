export const INITIAL_EVIDENCE = [
  {
    id: "ev-101",
    studentId: "std-101",
    type: "project",
    title: "Data Pipeline Project",
    description: "Built scalable ETL pipeline processing 1M+ daily records using Python, Pandas, and AWS S3.",
    fileUrl: "https://github.com/student/data-pipeline-demo",
    fileHash: "sha256:9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
    verificationTier: "verified-high",
    verificationReason: "QR-confirmed repository commit hash and verified institutional signature",
    verificationStage: "completed",
    verifiedAt: "2026-08-10T14:30:00Z",
    adminOverride: null,
    claimedSkills: ["Python", "Data Engineering", "SQL"]
  },
  {
    id: "ev-102",
    studentId: "std-101",
    type: "coursework",
    title: "DBMS Coursework & Lab Grade (92%)",
    description: "Completed Advanced Database Systems course covering query optimization, indexing, and relational schemas.",
    fileUrl: "https://university.edu/transcripts/verify?id=99201",
    fileHash: "sha256:a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0",
    verificationTier: "verified-medium",
    verificationReason: "OCR-parsed grade report matching university domain header",
    verificationStage: "completed",
    verifiedAt: "2026-08-11T09:15:00Z",
    adminOverride: null,
    claimedSkills: ["SQL", "Relational Databases"]
  },
  {
    id: "ev-103",
    studentId: "std-101",
    type: "micro-credential",
    title: "Deep Learning Specialization - Coursera",
    description: "5-course series covering Neural Networks, Convolutional Networks, and Sequence Models.",
    fileUrl: "https://coursera.org/verify/specialization/DL99201",
    fileHash: "sha256:7c8b9a0f1e2d3c4b5a697887960514233445566778899aabbccddeeff0011223",
    verificationTier: "verified-high",
    verificationReason: "Automated API verification with Coursera credential registry",
    verificationStage: "completed",
    verifiedAt: "2026-08-12T16:45:00Z",
    adminOverride: null,
    claimedSkills: ["Python", "TensorFlow", "Deep Learning"]
  },
  {
    id: "ev-104",
    studentId: "std-101",
    type: "competition",
    title: "Hackathon 2026 - 2nd Place Winner",
    description: "Built automated skill extraction app using React and Tailwind CSS in 48 hours.",
    fileUrl: "https://devpost.com/software/skillsync-prototype",
    fileHash: "sha256:11223344556677889900aabbccddeeff11223344556677889900aabbccddeeff",
    verificationTier: "flagged-low",
    verificationReason: "Self-submitted link without digital signature or institutional co-signer",
    verificationStage: "flagged_review",
    verifiedAt: "2026-08-13T11:00:00Z",
    adminOverride: null,
    claimedSkills: ["React.js", "Tailwind CSS"]
  }
];

export const INITIAL_SKILL_TAXONOMY = [
  { id: "sk-1", name: "Python", category: "Programming Languages", description: "Core syntax, data structures, and standard libraries." },
  { id: "sk-2", name: "SQL", category: "Databases", description: "Relational database querying, joins, and indexing." },
  { id: "sk-3", name: "React.js", category: "Frontend Web", description: "Modern React with hooks, state management, and component architecture." },
  { id: "sk-4", name: "TensorFlow", category: "AI & Machine Learning", description: "Deep learning models, tensor manipulation, and training loops." },
  { id: "sk-5", name: "Docker", category: "DevOps & Cloud", description: "Containerization, Dockerfiles, and multi-stage builds." },
  { id: "sk-6", name: "REST API design", category: "Backend Engineering", description: "HTTP endpoints, JSON payloads, and API authentication." },
  { id: "sk-7", name: "Tailwind CSS", category: "Frontend Web", description: "Utility-first CSS styling and responsive layout design." },
  { id: "sk-8", name: "Data Engineering", category: "Data Science", description: "ETL pipelines, data cleaning, and processing." }
];

export const INITIAL_PASSPORT = {
  studentId: "SS-2024-7F8A2B",
  studentName: "Ananya Sharma",
  gender: "Female",
  dob: "12 May 2003",
  college: "Ramaiah Institute of Technology",
  degree: "B.Tech in Computer Science & Engineering (Pursuing)",
  batch: "2022 – 2026",
  photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop",
  verified: true,
  issuer: "SkillSync Verifiable Credential Engine",
  credentialHash: "0x7F8A2B9942ACD081884C7D659A2FEAA015A3BF4F",
  shareToken: "sp-token-9942a",
  isPublic: true,
  updatedAt: "2026-08-13T12:00:00Z",
  skills: [
    {
      skillId: "sk-3",
      name: "React.js",
      category: "Frontend Web",
      icon: "react",
      level: "Advanced",
      endorsements: 14,
      evidence: [
        { id: "ev-104", title: "EcoTrack & Hackathon 2026 Component Architecture", tier: "verified-high", hash: "sha256:11223344" },
        { id: "ev-105", title: "Advanced React & Next.js Design Patterns Certification", tier: "verified-high", hash: "sha256:55667788" }
      ]
    },
    {
      skillId: "sk-node",
      name: "Node.js",
      category: "Backend Engineering",
      icon: "nodejs",
      level: "Advanced",
      endorsements: 11,
      evidence: [
        { id: "ev-106", title: "ShopNest REST & Microservices Architecture", tier: "verified-high", hash: "sha256:99aabbcc" },
        { id: "ev-107", title: "NexusChat Socket.io Realtime Server Suite", tier: "verified-medium", hash: "sha256:ddeeff00" }
      ]
    },
    {
      skillId: "sk-1",
      name: "Python",
      category: "Programming Languages",
      icon: "python",
      level: "Advanced",
      endorsements: 19,
      evidence: [
        { id: "ev-101", title: "ETL Data Pipeline & Pandas Pipeline Demo", tier: "verified-high", hash: "sha256:9f86d081" },
        { id: "ev-103", title: "Deep Learning Specialization - Coursera", tier: "verified-high", hash: "sha256:7c8b9a0f" }
      ]
    },
    {
      skillId: "sk-js",
      name: "JavaScript",
      category: "Frontend & Scripting",
      icon: "javascript",
      level: "Expert",
      endorsements: 22,
      evidence: [
        { id: "ev-108", title: "Full-Stack Web Dev Capstone (Grade 96%)", tier: "verified-high", hash: "sha256:33445566" },
        { id: "ev-109", title: "Asynchronous JS & State Engine Lab", tier: "verified-medium", hash: "sha256:778899aa" }
      ]
    },
    {
      skillId: "sk-git",
      name: "Git & GitHub",
      category: "DevOps & Tooling",
      icon: "git",
      level: "Advanced",
      endorsements: 16,
      evidence: [
        { id: "ev-110", title: "Verified 200+ Open Source Commits & Signed GPG Keys", tier: "verified-high", hash: "sha256:bbccddee" }
      ]
    }
  ],
  projects: [
    {
      id: "proj-1",
      title: "EcoTrack – Carbon Footprint Tracker",
      description: "A web application to track and analyze carbon footprint using interactive dashboards and ML insights.",
      icon: "leaf",
      color: "emerald",
      githubUrl: "https://github.com/ananya-sharma/ecotrack",
      liveUrl: "https://ecotrack.skillsync.dev",
      skills: ["React.js", "Python", "Tailwind CSS"],
      verified: true
    },
    {
      id: "proj-2",
      title: "ShopNest – E-commerce Web App",
      description: "Full-stack e-commerce platform with authentication, payment integration, and order management.",
      icon: "cart",
      color: "purple",
      githubUrl: "https://github.com/ananya-sharma/shopnest",
      liveUrl: "https://shopnest.skillsync.dev",
      skills: ["React.js", "Node.js", "JavaScript"],
      verified: true
    },
    {
      id: "proj-3",
      title: "NexusChat – Real-time Chat Application",
      description: "Real-time chat application using Socket.io, Express.js, and MongoDB.",
      icon: "chat",
      color: "blue",
      githubUrl: "https://github.com/ananya-sharma/nexuschat",
      liveUrl: "https://nexuschat.skillsync.dev",
      skills: ["Node.js", "JavaScript", "Git & GitHub"],
      verified: true
    }
  ]
};

export const INITIAL_OPPORTUNITIES = [
  {
    id: "opt-1",
    sourceApi: "Adzuna",
    sourceListingId: "adz-881920",
    title: "ML Intern - DataCo",
    company: "DataCo Analytics",
    location: "Remote / San Francisco, CA",
    description: "We are looking for a Machine Learning Intern to assist with automated data pipeline development, SQL optimization, and model training.",
    externalUrl: "https://adzuna.com/jobs/details/adz-881920",
    requiredSkillIds: ["sk-1", "sk-2", "sk-5", "sk-6"],
    requiredSkills: ["Python", "SQL", "Docker", "REST API design"],
    ingestedAt: "2026-08-13T08:00:00Z",
    matchScore: 0.82,
    explanation: {
      opportunity: "ML Intern - DataCo (via Adzuna)",
      matchScore: 0.82,
      supportingEvidence: [
        { skill: "Python", evidence: "'Data Pipeline Project' — verified-high" },
        { skill: "SQL", evidence: "DBMS coursework, 92% — verified-medium" }
      ],
      missingSkills: ["Docker", "REST API design"],
      excludedFromRanking: ["gender", "college tier", "name", "photo"]
    }
  },
  {
    id: "opt-2",
    sourceApi: "Jooble",
    sourceListingId: "jbl-554109",
    title: "Junior Data Engineer",
    company: "Nexus Insights",
    location: "New York, NY (Hybrid)",
    description: "Join Nexus Insights to build robust ETL data streams using Python, SQL, and database management principles.",
    externalUrl: "https://jooble.org/desc/jbl-554109",
    requiredSkillIds: ["sk-1", "sk-2", "sk-8"],
    requiredSkills: ["Python", "SQL", "Data Engineering"],
    ingestedAt: "2026-08-13T09:30:00Z",
    matchScore: 0.95,
    explanation: {
      opportunity: "Junior Data Engineer - Nexus Insights (via Jooble)",
      matchScore: 0.95,
      supportingEvidence: [
        { skill: "Python", evidence: "'Data Pipeline Project' — verified-high" },
        { skill: "SQL", evidence: "DBMS coursework, 92% — verified-medium" },
        { skill: "Data Engineering", evidence: "'Data Pipeline Project' — verified-high" }
      ],
      missingSkills: [],
      excludedFromRanking: ["gender", "college tier", "name", "photo"]
    }
  },
  {
    id: "opt-3",
    sourceApi: "Remotive",
    sourceListingId: "rem-900213",
    title: "Frontend Developer Intern",
    company: "CloudCanvas",
    location: "Global Remote",
    description: "Looking for an energetic intern passionate about modern UI development with React.js, Tailwind CSS, and API integrations.",
    externalUrl: "https://remotive.com/remote-jobs/engineering/frontend-dev-intern-900213",
    requiredSkillIds: ["sk-3", "sk-7", "sk-6"],
    requiredSkills: ["React.js", "Tailwind CSS", "REST API design"],
    ingestedAt: "2026-08-13T10:15:00Z",
    matchScore: 0.60,
    explanation: {
      opportunity: "Frontend Developer Intern - CloudCanvas (via Remotive)",
      matchScore: 0.60,
      supportingEvidence: [
        { skill: "Tailwind CSS", evidence: "Hackathon 2026 — flagged-low" }
      ],
      missingSkills: ["React.js", "REST API design"],
      excludedFromRanking: ["gender", "college tier", "name", "photo"]
    }
  }
];

export const INITIAL_FAIRNESS_AUDIT_LOGS = [
  {
    id: "audit-1001",
    timestamp: "2026-08-13T12:00:00Z",
    runId: "run-99401",
    totalCandidates: 142,
    matchingOpportunities: 3,
    excludedParameters: ["gender", "college tier", "name", "photo"],
    status: "PASSED",
    scoreDistribution: [
      { scoreRange: "90-100%", count: 18 },
      { scoreRange: "80-89%", count: 42 },
      { scoreRange: "70-79%", count: 54 },
      { scoreRange: "< 70%", count: 28 }
    ]
  },
  {
    id: "audit-1000",
    timestamp: "2026-08-13T06:00:00Z",
    runId: "run-99400",
    totalCandidates: 138,
    matchingOpportunities: 3,
    excludedParameters: ["gender", "college tier", "name", "photo"],
    status: "PASSED",
    scoreDistribution: [
      { scoreRange: "90-100%", count: 15 },
      { scoreRange: "80-89%", count: 40 },
      { scoreRange: "70-79%", count: 58 },
      { scoreRange: "< 70%", count: 25 }
    ]
  }
];
