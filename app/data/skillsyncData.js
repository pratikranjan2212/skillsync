export const AUDIENCE_TAGS = [
  "#Students",
  "#Engineers",
  "#Recruiters",
  "#DataScientists",
  "#Developers",
  "#Graduates",
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
    imageUrl: "/job-seeker.png",
    quote: "Every match recommendation cites the exact project or transcript grade behind it and tells me what skills I'm missing.",
  },
  {
    id: "recruiters",
    label: "Recruiters",
    icon: "Users",
    title: "Access pre-verified candidates with transparent evidence citations and zero demographic bias.",
    metric: "Zero",
    metricLabel: "Demographic bias",
    imageUrl: "/recruiter.jpg",
    quote: "SkillSync's explicit fairness guarantee excludes gender, college tier, name, and photo from ranking models.",
  },
  {
    id: "admin-auditors",
    label: "Admin Auditors",
    icon: "Shield",
    title: "Review automated evidence pipelines, override tiers, and monitor real-time fairness audits.",
    metric: "Real-time",
    metricLabel: "Fairness audit logging",
    imageUrl: "/admin-auditor.jpg",
    quote: "The admin audit suite lets us inspect score distribution charts and enforce policy compliance effortless.",
  },
];

export const SMART_ASSIST_CARDS = [
  {
    id: "c1",
    icon: "CheckCircle2",
    iconBg: "bg-[#10b981]",
    iconShadow: "shadow-[0_8px_20px_rgba(16,185,129,0.45)]",
    cardGlow: "shadow-[0_24px_50px_-8px_rgba(16,185,129,0.34)] border border-emerald-500/20 hover:border-emerald-500/50 hover:shadow-[0_32px_60px_-6px_rgba(16,185,129,0.45)]",
    title: "3-Tier Verification Engine",
    description: "Assigns verified-high, verified-medium, or flagged-low badges based on QR codes, OCR parsing, and digital signatures.",
  },
  {
    id: "c2",
    icon: "Award",
    iconBg: "bg-[#f59e0b]",
    iconShadow: "shadow-[0_8px_20px_rgba(245,158,11,0.45)]",
    cardGlow: "shadow-[0_24px_50px_-8px_rgba(245,158,11,0.34)] border border-amber-500/20 hover:border-amber-500/50 hover:shadow-[0_32px_60px_-6px_rgba(245,158,11,0.45)]",
    title: "Portable Skill Passport",
    description: "Groups verified skills by taxonomy domain with shareable public links, JSON exports, and PDF generation.",
  },
  {
    id: "c3",
    icon: "Briefcase",
    iconBg: "bg-[#3b82f6]",
    iconShadow: "shadow-[0_8px_20px_rgba(59,130,246,0.45)]",
    cardGlow: "shadow-[0_24px_50px_-8px_rgba(59,130,246,0.34)] border border-blue-500/20 hover:border-blue-500/50 hover:shadow-[0_32px_60px_-6px_rgba(59,130,246,0.45)]",
    title: "Public Job Ingestion",
    description: "Automatically ingests public internship listings from Adzuna, Jooble, and Remotive with zero manual provider posting.",
  },
  {
    id: "c4",
    icon: "Scale",
    iconBg: "bg-[#262626]",
    iconShadow: "shadow-[0_8px_20px_rgba(0,0,0,0.45)]",
    cardGlow: "shadow-[0_24px_50px_-8px_rgba(0,0,0,0.38)] border border-black/15 hover:border-neutral-900/50 hover:shadow-[0_32px_60px_-6px_rgba(0,0,0,0.5)]",
    title: "Algorithmic Fairness Guarantee",
    description: "Explicitly renders excludedFromRanking: ['gender', 'college tier', 'name', 'photo'] for complete transparency.",
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
