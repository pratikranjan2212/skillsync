// SkillSync Official Data File - Skill Verification & Match Engine Content

export const NAV_LINKS = [
  { id: "verification-tiers", label: "Verification Tiers" },
  { id: "skill-passport", label: "Skill Passport" },
  { id: "match-engine", label: "Match Engine" },
  { id: "fairness-audit", label: "Fairness Guarantee" },
];

export const HERO_INITIAL_VERIFICATIONS = [
  {
    id: "1",
    title: "Data Pipeline Project",
    type: "GitHub Repository",
    tier: "verified-high",
    tierLabel: "verified-high (QR-confirmed)",
    badgeColor: "emerald",
    completed: true,
  },
  {
    id: "2",
    title: "CS229 Machine Learning Grade (92%)",
    type: "University Transcript",
    tier: "verified-medium",
    tierLabel: "verified-medium (OCR-parsed)",
    badgeColor: "amber",
    completed: true,
  },
  {
    id: "3",
    title: "Deep Learning Specialization",
    type: "Coursera API Certificate",
    tier: "verified-high",
    tierLabel: "verified-high (API-confirmed)",
    badgeColor: "emerald",
    completed: true,
  },
];

export const HERO_SKILL_SCORES = [
  { label: "Python", percentage: "95%", icon: "Code2" },
  { label: "SQL", percentage: "92%", icon: "Database" },
  { label: "TensorFlow", percentage: "88%", icon: "Cpu" },
];

export const AUDIENCE_TAGS = [
  "#Students",
  "#Engineers",
  "#Recruiters",
  "#DataScientists",
  "#Developers",
  "#Graduates",
];

export const MARQUEE_ITEMS_TOP = [
  {
    id: "m1",
    type: "card",
    title: "Python Data Pipelines",
    subtitle: "verified-high (QR-confirmed)",
    icon: "Code2",
    bgColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  {
    id: "m2",
    type: "card",
    title: "DBMS Coursework (92%)",
    subtitle: "verified-medium (OCR-parsed)",
    icon: "Database",
    bgColor: "bg-amber-50 text-amber-700 border-amber-200",
  },
  {
    id: "m3",
    type: "card",
    title: "Deep Learning Certificate",
    subtitle: "verified-high (API-confirmed)",
    icon: "Award",
    bgColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  {
    id: "m4",
    type: "card",
    title: "Hackathon Prototype",
    subtitle: "flagged-low (Self-submitted)",
    icon: "ShieldAlert",
    bgColor: "bg-rose-50 text-rose-700 border-rose-200",
  },
];

export const MARQUEE_ITEMS_BOTTOM = [
  {
    id: "mb1",
    type: "card",
    title: "ML Intern - DataCo",
    subtitle: "82% Match • Adzuna API",
    icon: "Sparkles",
    bgColor: "bg-purple-50 text-purple-700 border-purple-200",
  },
  {
    id: "mb2",
    type: "card",
    title: "Junior Data Engineer",
    subtitle: "95% Match • Jooble API",
    icon: "Briefcase",
    bgColor: "bg-cyan-50 text-cyan-700 border-cyan-200",
  },
  {
    id: "mb3",
    type: "card",
    title: "Frontend Dev Intern",
    subtitle: "60% Match • Remotive API",
    icon: "Laptop",
    bgColor: "bg-[#F5F5F3] text-neutral-800 border-black/10",
  },
];

export const FAIRNESS_EXCLUDED_PARAMS = [
  "gender",
  "college tier",
  "name",
  "photo",
];

export const USE_CASE_TABS = [
  {
    id: "students",
    label: "Students",
    icon: "GraduationCap",
    title: "Turn coursework, labs, and side projects into an automated, portable Skill Passport.",
    metric: "100%",
    metricLabel: "Automated verification",
    imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop",
    quote: "SkillSync converted my machine learning coursework into verified evidence badges without requiring manual professor sign-off.",
  },
  {
    id: "graduates",
    label: "Job Seekers",
    icon: "Briefcase",
    title: "Get matched with public internship listings ranked strictly against verified evidence.",
    metric: "0.95",
    metricLabel: "Top match accuracy",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1200&auto=format&fit=crop",
    quote: "Every match recommendation cites the exact project or transcript grade behind it and tells me what skills I'm missing.",
  },
  {
    id: "recruiters",
    label: "Recruiters",
    icon: "Users",
    title: "Access pre-verified candidates with transparent evidence citations and zero demographic bias.",
    metric: "Zero",
    metricLabel: "Demographic bias",
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1200&auto=format&fit=crop",
    quote: "SkillSync's explicit fairness guarantee excludes gender, college tier, name, and photo from ranking models.",
  },
  {
    id: "admin-auditors",
    label: "Admin Auditors",
    icon: "Shield",
    title: "Review automated evidence pipelines, override tiers, and monitor real-time fairness audits.",
    metric: "Real-time",
    metricLabel: "Fairness audit logging",
    imageUrl: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=1200&auto=format&fit=crop",
    quote: "The admin audit suite lets us inspect score distribution charts and enforce policy compliance effortless.",
  },
];

export const SMART_ASSIST_CARDS = [
  {
    id: "c1",
    icon: "CheckCircle2",
    iconBg: "bg-emerald-500",
    iconShadow: "shadow-[0_10px_28px_2px_rgba(16,185,129,0.85),0_4px_12px_0px_rgba(16,185,129,0.6)]",
    cardShadow: "shadow-[0_20px_50px_-6px_rgba(0,0,0,0.12),0_10px_30px_-4px_rgba(16,185,129,0.22)] border-b-[5px] border-b-emerald-500/35 hover:border-b-emerald-500 hover:shadow-[0_30px_70px_-8px_rgba(16,185,129,0.38),0_15px_35px_-5px_rgba(0,0,0,0.18)]",
    title: "3-Tier Verification Engine",
    description: "Assigns verified-high, verified-medium, or flagged-low badges based on QR codes, OCR parsing, and digital signatures.",
  },
  {
    id: "c2",
    icon: "Award",
    iconBg: "bg-amber-500",
    iconShadow: "shadow-[0_10px_28px_2px_rgba(245,158,11,0.85),0_4px_12px_0px_rgba(245,158,11,0.6)]",
    cardShadow: "shadow-[0_20px_50px_-6px_rgba(0,0,0,0.12),0_10px_30px_-4px_rgba(245,158,11,0.22)] border-b-[5px] border-b-amber-500/35 hover:border-b-amber-500 hover:shadow-[0_30px_70px_-8px_rgba(245,158,11,0.38),0_15px_35px_-5px_rgba(0,0,0,0.18)]",
    title: "Portable Skill Passport",
    description: "Groups verified skills by taxonomy domain with shareable public links, JSON exports, and PDF generation.",
  },
  {
    id: "c3",
    icon: "Briefcase",
    iconBg: "bg-blue-500",
    iconShadow: "shadow-[0_10px_28px_2px_rgba(59,130,246,0.85),0_4px_12px_0px_rgba(59,130,246,0.6)]",
    cardShadow: "shadow-[0_20px_50px_-6px_rgba(0,0,0,0.12),0_10px_30px_-4px_rgba(59,130,246,0.22)] border-b-[5px] border-b-blue-500/35 hover:border-b-blue-500 hover:shadow-[0_30px_70px_-8px_rgba(59,130,246,0.38),0_15px_35px_-5px_rgba(0,0,0,0.18)]",
    title: "Public Job Ingestion",
    description: "Automatically ingests public internship listings from Adzuna, Jooble, and Remotive with zero manual provider posting.",
  },
  {
    id: "c4",
    icon: "Scale",
    iconBg: "bg-[#111111]",
    iconShadow: "shadow-[0_10px_28px_2px_rgba(17,17,17,0.85),0_4px_12px_0px_rgba(17,17,17,0.6)]",
    cardShadow: "shadow-[0_20px_50px_-6px_rgba(0,0,0,0.15),0_10px_30px_-4px_rgba(17,17,17,0.25)] border-b-[5px] border-b-neutral-900/50 hover:border-b-neutral-900 hover:shadow-[0_30px_70px_-8px_rgba(17,17,17,0.45),0_15px_35px_-5px_rgba(0,0,0,0.18)]",
    title: "Algorithmic Fairness Guarantee",
    description: "Explicitly renders excludedFromRanking: ['gender', 'college tier', 'name', 'photo'] for complete transparency.",
  },
];

export const MASONRY_REVIEWS = [
  {
    id: "r1",
    quote: "SkillSync made my coursework count! My machine learning project got automatically verified with a QR signature.",
    name: "Maya Zong",
    role: "Computer Science Student",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: "r2",
    quote: "The explainable match card literally listed why I matched 82% with DataCo — citing my SQL coursework and Python pipeline.",
    name: "Ethan Miller",
    role: "Junior Data Engineer",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: "r3",
    quote: "As an admin, being able to audit model parameters and override evidence tiers in real-time gives complete peace of mind.",
    name: "Hannah Lee",
    role: "Academic Compliance Lead",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
  },
];

export const FAQ_ITEMS = [
  {
    id: "faq1",
    question: "How does automated evidence verification work?",
    answer: "SkillSync automatically parses uploaded transcripts, GitHub code repositories, and certificate links using OCR, digital signature validation, and API checks — assigning verified-high, verified-medium, or flagged-low tiers without requiring a human verifier.",
  },
  {
    id: "faq2",
    question: "What is the Fairness Exclusion List?",
    answer: "The SkillSync matching engine explicitly excludes candidate gender, college tier, name, and photo from all ranking models (excludedFromRanking: ['gender', 'college tier', 'name', 'photo']), guaranteeing 100% skill-based matching.",
  },
  {
    id: "faq3",
    question: "Where do internship opportunities come from?",
    answer: "Job listings are ingested automatically via public job APIs such as Adzuna, Jooble, and Remotive. Employers do not manually post listings; backend automation handles ingestion.",
  },
  {
    id: "faq4",
    question: "How do PDF & JSON exports work for the Skill Passport?",
    answer: "Students can toggle their passport to Public or Private, copy share links, or trigger instant client-side downloads for raw JSON schemas and formal PDF documents.",
  },
  {
    id: "faq5",
    question: "Can admins manually override verification tiers?",
    answer: "Yes. Admin users access the protected Admin Pipeline Console (/admin/pipeline) to review evidence stages and trigger manual tier overrides whenever necessary.",
  },
];
