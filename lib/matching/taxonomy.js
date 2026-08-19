/**
 * SkillSync Comprehensive Skill Taxonomy, Alias Resolver & Controlled Semantic Relationship Graph.
 */

// Normalized alias lookups mapping variations directly to canonical skill keys
export const SKILL_ALIASES = {
  // Python ecosystem
  "python": "python",
  "python3": "python",
  "python 3": "python",
  "py": "python",
  "python programming": "python",
  "python programming language": "python",

  // JavaScript / TypeScript ecosystem
  "js": "javascript",
  "javascript": "javascript",
  "vanilla js": "javascript",
  "vanillajs": "javascript",
  "ecmascript": "javascript",
  "ts": "typescript",
  "typescript": "typescript",
  "typescript lang": "typescript",

  // Frontend frameworks & libraries
  "react": "react",
  "reactjs": "react",
  "react.js": "react",
  "react js": "react",
  "next": "next.js",
  "nextjs": "next.js",
  "next.js": "next.js",
  "next js": "next.js",
  "vue": "vue.js",
  "vuejs": "vue.js",
  "vue.js": "vue.js",
  "angular": "angular",
  "angularjs": "angular",
  "svelte": "svelte",
  "tailwind": "tailwind css",
  "tailwindcss": "tailwind css",
  "tailwind css": "tailwind css",
  "html": "html",
  "html5": "html",
  "html/css": "html/css",
  "css": "css",
  "css3": "css",
  "redux": "redux",
  "redux toolkit": "redux",

  // Mobile
  "react native": "react native",
  "react-native": "react native",
  "reactnative": "react native",
  "flutter": "flutter",
  "dart": "dart",
  "swift": "swift",
  "kotlin": "kotlin",
  "android": "android",
  "ios": "ios",

  // Backend frameworks & runtimes
  "node": "node.js",
  "nodejs": "node.js",
  "node.js": "node.js",
  "node js": "node.js",
  "express": "express",
  "expressjs": "express",
  "express.js": "express",
  "express js": "express",
  "nestjs": "nestjs",
  "nest.js": "nestjs",
  "django": "django",
  "django framework": "django",
  "drf": "django rest framework",
  "django rest": "django rest framework",
  "django rest framework": "django rest framework",
  "flask": "flask",
  "fastapi": "fastapi",
  "fast api": "fastapi",
  "spring": "spring boot",
  "springboot": "spring boot",
  "spring boot": "spring boot",
  "spring framework": "spring boot",

  // Core Languages
  "java": "java",
  "java 8": "java",
  "java 11": "java",
  "java 17": "java",
  "java 21": "java",
  "c++": "c++",
  "cpp": "c++",
  "c plus plus": "c++",
  "c#": "c#",
  "csharp": "c#",
  "c sharp": "c#",
  "c": "c",
  "golang": "go",
  "go": "go",
  "rust": "rust",
  "php": "php",
  "ruby": "ruby",
  "ruby on rails": "ruby on rails",
  "rails": "ruby on rails",

  // Databases & Storage
  "sql": "sql",
  "structured query language": "sql",
  "relational database": "sql",
  "rdbms": "sql",
  "postgres": "postgresql",
  "postgresql": "postgresql",
  "psql": "postgresql",
  "mysql": "mysql",
  "sqlite": "sqlite",
  "mongo": "mongodb",
  "mongodb": "mongodb",
  "redis": "redis",
  "cassandra": "cassandra",
  "dynamodb": "dynamodb",
  "prisma": "prisma",

  // AI / ML / Data Science
  "ml": "machine learning",
  "machine learning": "machine learning",
  "dl": "deep learning",
  "deep learning": "deep learning",
  "ai": "artificial intelligence",
  "artificial intelligence": "artificial intelligence",
  "data science": "data science",
  "data engineering": "data engineering",
  "etl": "data engineering",
  "etl pipelines": "data engineering",
  "data pipelines": "data engineering",
  "pandas": "pandas",
  "numpy": "numpy",
  "scikit-learn": "scikit-learn",
  "scikit learn": "scikit-learn",
  "sklearn": "scikit-learn",
  "tensorflow": "tensorflow",
  "tf": "tensorflow",
  "pytorch": "pytorch",
  "torch": "pytorch",
  "nlp": "nlp",
  "natural language processing": "nlp",
  "cv": "computer vision",
  "computer vision": "computer vision",
  "llm": "llms",
  "llms": "llms",
  "generative ai": "generative ai",
  "genai": "generative ai",

  // Cloud / DevOps / Infrastructure
  "docker": "docker",
  "dockerfile": "docker",
  "containers": "docker",
  "containerization": "docker",
  "kubernetes": "kubernetes",
  "k8s": "kubernetes",
  "aws": "aws",
  "amazon web services": "aws",
  "gcp": "gcp",
  "google cloud": "gcp",
  "google cloud platform": "gcp",
  "azure": "azure",
  "microsoft azure": "azure",
  "ci/cd": "ci/cd",
  "cicd": "ci/cd",
  "linux": "linux",
  "bash": "bash",
  "shell scripting": "bash",
  "terraform": "terraform",
  "devops": "devops",

  // Version Control & Architecture & APIs
  "git": "git",
  "git & github": "git",
  "github": "git",
  "gitlab": "git",
  "version control": "git",
  "rest": "rest api",
  "rest api": "rest api",
  "restful": "rest api",
  "restful apis": "rest api",
  "rest api design": "rest api",
  "graphql": "graphql",
  "microservices": "microservices",
  "dsa": "data structures & algorithms",
  "data structures": "data structures & algorithms",
  "data structures & algorithms": "data structures & algorithms",
  "oop": "object oriented programming",
  "object oriented programming": "object oriented programming",
};

// Skill Taxonomy Domain, Category & Criticality classification
export const SKILL_DEFINITIONS = {
  "python": { name: "Python", category: "Programming Language", domain: "Backend & Data", criticality: "CRITICAL" },
  "javascript": { name: "JavaScript", category: "Programming Language", domain: "Frontend & Full-Stack", criticality: "CRITICAL" },
  "typescript": { name: "TypeScript", category: "Programming Language", domain: "Frontend & Full-Stack", criticality: "CRITICAL" },
  "java": { name: "Java", category: "Programming Language", domain: "Backend & Systems", criticality: "CRITICAL" },
  "c++": { name: "C++", category: "Programming Language", domain: "Systems & Performance", criticality: "CRITICAL" },
  "c#": { name: "C#", category: "Programming Language", domain: "Enterprise & Games", criticality: "CRITICAL" },
  "c": { name: "C", category: "Programming Language", domain: "Embedded & Systems", criticality: "CRITICAL" },
  "go": { name: "Go", category: "Programming Language", domain: "Cloud & Systems", criticality: "CRITICAL" },
  "rust": { name: "Rust", category: "Programming Language", domain: "Systems & Performance", criticality: "CRITICAL" },
  "kotlin": { name: "Kotlin", category: "Programming Language", domain: "Mobile & Backend", criticality: "CRITICAL" },
  "swift": { name: "Swift", category: "Programming Language", domain: "Mobile", criticality: "CRITICAL" },
  "php": { name: "PHP", category: "Programming Language", domain: "Web Backend", criticality: "CRITICAL" },
  "ruby": { name: "Ruby", category: "Programming Language", domain: "Web Backend", criticality: "CRITICAL" },

  "react": { name: "React", category: "Frontend Framework", domain: "Frontend & Full-Stack", criticality: "CRITICAL" },
  "next.js": { name: "Next.js", category: "Full-Stack Framework", domain: "Frontend & Full-Stack", criticality: "CRITICAL" },
  "vue.js": { name: "Vue.js", category: "Frontend Framework", domain: "Frontend", criticality: "CRITICAL" },
  "angular": { name: "Angular", category: "Frontend Framework", domain: "Frontend", criticality: "CRITICAL" },
  "tailwind css": { name: "Tailwind CSS", category: "Styling Library", domain: "Frontend", criticality: "STANDARD" },
  "html/css": { name: "HTML/CSS", category: "Web Standards", domain: "Frontend", criticality: "STANDARD" },
  "html": { name: "HTML", category: "Web Standards", domain: "Frontend", criticality: "STANDARD" },
  "css": { name: "CSS", category: "Web Standards", domain: "Frontend", criticality: "STANDARD" },
  "redux": { name: "Redux", category: "State Management", domain: "Frontend", criticality: "STANDARD" },

  "django": { name: "Django", category: "Backend Framework", domain: "Backend & Systems", criticality: "CRITICAL" },
  "django rest framework": { name: "Django REST Framework", category: "API Framework", domain: "Backend", criticality: "CRITICAL" },
  "fastapi": { name: "FastAPI", category: "Backend Framework", domain: "Backend", criticality: "CRITICAL" },
  "flask": { name: "Flask", category: "Backend Framework", domain: "Backend", criticality: "CRITICAL" },
  "spring boot": { name: "Spring Boot", category: "Backend Framework", domain: "Backend & Systems", criticality: "CRITICAL" },
  "node.js": { name: "Node.js", category: "Backend Runtime", domain: "Backend & Full-Stack", criticality: "CRITICAL" },
  "express": { name: "Express", category: "Backend Framework", domain: "Backend", criticality: "STANDARD" },
  "nestjs": { name: "NestJS", category: "Backend Framework", domain: "Backend", criticality: "CRITICAL" },

  "sql": { name: "SQL", category: "Database Language", domain: "Databases & Storage", criticality: "CRITICAL" },
  "postgresql": { name: "PostgreSQL", category: "Relational Database", domain: "Databases & Storage", criticality: "STANDARD" },
  "mysql": { name: "MySQL", category: "Relational Database", domain: "Databases & Storage", criticality: "STANDARD" },
  "mongodb": { name: "MongoDB", category: "NoSQL Database", domain: "Databases & Storage", criticality: "STANDARD" },
  "redis": { name: "Redis", category: "In-Memory Cache", domain: "Databases & Storage", criticality: "STANDARD" },
  "sqlite": { name: "SQLite", category: "Embedded Database", domain: "Databases & Storage", criticality: "SECONDARY" },
  "prisma": { name: "Prisma", category: "ORM", domain: "Databases & Storage", criticality: "SECONDARY" },

  "machine learning": { name: "Machine Learning", category: "Core AI", domain: "AI, ML & Data", criticality: "CRITICAL" },
  "deep learning": { name: "Deep Learning", category: "Advanced AI", domain: "AI, ML & Data", criticality: "CRITICAL" },
  "artificial intelligence": { name: "Artificial Intelligence", category: "AI Discipline", domain: "AI, ML & Data", criticality: "CRITICAL" },
  "data science": { name: "Data Science", category: "Analytics", domain: "AI, ML & Data", criticality: "CRITICAL" },
  "data engineering": { name: "Data Engineering", category: "Data Pipelines", domain: "AI, ML & Data", criticality: "CRITICAL" },
  "pandas": { name: "Pandas", category: "Data Processing", domain: "AI, ML & Data", criticality: "STANDARD" },
  "numpy": { name: "NumPy", category: "Numerical Computing", domain: "AI, ML & Data", criticality: "STANDARD" },
  "scikit-learn": { name: "Scikit-Learn", category: "ML Library", domain: "AI, ML & Data", criticality: "STANDARD" },
  "tensorflow": { name: "TensorFlow", category: "Deep Learning Framework", domain: "AI, ML & Data", criticality: "CRITICAL" },
  "pytorch": { name: "PyTorch", category: "Deep Learning Framework", domain: "AI, ML & Data", criticality: "CRITICAL" },
  "nlp": { name: "NLP", category: "Specialized AI", domain: "AI, ML & Data", criticality: "STANDARD" },
  "computer vision": { name: "Computer Vision", category: "Specialized AI", domain: "AI, ML & Data", criticality: "STANDARD" },

  "docker": { name: "Docker", category: "Containers", domain: "Cloud & DevOps", criticality: "STANDARD" },
  "kubernetes": { name: "Kubernetes", category: "Container Orchestration", domain: "Cloud & DevOps", criticality: "STANDARD" },
  "aws": { name: "AWS", category: "Cloud Platform", domain: "Cloud & DevOps", criticality: "STANDARD" },
  "gcp": { name: "GCP", category: "Cloud Platform", domain: "Cloud & DevOps", criticality: "STANDARD" },
  "azure": { name: "Azure", category: "Cloud Platform", domain: "Cloud & DevOps", criticality: "STANDARD" },
  "ci/cd": { name: "CI/CD", category: "DevOps Practices", domain: "Cloud & DevOps", criticality: "SECONDARY" },
  "linux": { name: "Linux", category: "Operating System", domain: "Cloud & DevOps", criticality: "SECONDARY" },
  "git": { name: "Git", category: "Version Control", domain: "Software Engineering", criticality: "SECONDARY" },
  "rest api": { name: "REST API", category: "Architecture", domain: "Software Engineering", criticality: "SECONDARY" },
  "graphql": { name: "GraphQL", category: "API Query Language", domain: "Software Engineering", criticality: "STANDARD" },
  "react native": { name: "React Native", category: "Mobile Framework", domain: "Mobile", criticality: "CRITICAL" },
  "flutter": { name: "Flutter", category: "Mobile Framework", domain: "Mobile", criticality: "CRITICAL" },
  "data structures & algorithms": { name: "Data Structures & Algorithms", category: "Computer Science", domain: "Software Engineering", criticality: "STANDARD" },
};

// Strict False Positive Prevention Checks
// Prevents incorrect matching between superficially similar tech names
const STRICT_INCOMPATIBLE_PAIRS = [
  new Set(["java", "javascript"]),
  new Set(["c", "c++"]),
  new Set(["c", "c#"]),
  new Set(["c++", "c#"]),
  new Set(["react", "react native"]),
  new Set(["aws", "azure"]),
  new Set(["aws", "gcp"]),
  new Set(["azure", "gcp"]),
  new Set(["django", "spring boot"]),
  new Set(["fastapi", "spring boot"]),
];

/**
 * Checks if two keys represent strictly distinct/incompatible technologies.
 */
export function areStrictlyIncompatible(keyA, keyB) {
  if (!keyA || !keyB || keyA === keyB) return false;
  for (const pair of STRICT_INCOMPATIBLE_PAIRS) {
    if (pair.has(keyA) && pair.has(keyB)) {
      return true;
    }
  }
  return false;
}

// Controlled Directed Semantic Relationships with calibrated partial match coefficients
export const SKILL_RELATIONSHIPS = {
  "postgresql": {
    "sql": { weight: 0.85, reason: "PostgreSQL directly demonstrates relational SQL proficiency" },
  },
  "mysql": {
    "sql": { weight: 0.85, reason: "MySQL directly demonstrates relational SQL proficiency" },
  },
  "sqlite": {
    "sql": { weight: 0.75, reason: "SQLite demonstrates standard SQL syntax" },
  },
  "sql": {
    "postgresql": { weight: 0.65, reason: "Core SQL foundational competency translates to PostgreSQL" },
    "mysql": { weight: 0.65, reason: "Core SQL foundational competency translates to MySQL" },
  },
  "django rest framework": {
    "django": { weight: 0.90, reason: "DRF mastery directly demonstrates Django web framework expertise" },
    "rest api": { weight: 0.90, reason: "DRF is a specialized REST API design framework" },
    "python": { weight: 0.85, reason: "DRF utilizes Python backend patterns" },
  },
  "django": {
    "django rest framework": { weight: 0.70, reason: "Django knowledge facilitates rapid DRF implementation" },
    "python": { weight: 0.85, reason: "Django framework implies solid Python competency" },
    "flask": { weight: 0.55, reason: "Django knowledge translates to Flask Python patterns" },
    "fastapi": { weight: 0.55, reason: "Django knowledge translates to FastAPI async web patterns" },
    "rest api": { weight: 0.75, reason: "Django developers routinely build RESTful endpoints" },
  },
  "fastapi": {
    "python": { weight: 0.85, reason: "FastAPI implies strong Python programming competency" },
    "rest api": { weight: 0.90, reason: "FastAPI is designed specifically for REST APIs" },
    "django": { weight: 0.55, reason: "FastAPI translates to Python backend patterns" },
    "flask": { weight: 0.65, reason: "FastAPI shares microframework design with Flask" },
  },
  "flask": {
    "python": { weight: 0.85, reason: "Flask implies solid Python competency" },
    "django": { weight: 0.55, reason: "Flask translates to Python backend patterns" },
    "fastapi": { weight: 0.65, reason: "Flask translates to FastAPI modern Python APIs" },
    "rest api": { weight: 0.75, reason: "Flask developers build RESTful API endpoints" },
  },
  "spring boot": {
    "java": { weight: 0.90, reason: "Spring Boot implies strong Java backend competency" },
    "rest api": { weight: 0.80, reason: "Spring Boot services implement REST APIs" },
  },
  "next.js": {
    "react": { weight: 0.95, reason: "Next.js is a full-stack React framework" },
    "javascript": { weight: 0.85, reason: "Next.js utilizes modern JavaScript" },
    "typescript": { weight: 0.80, reason: "Next.js heavily employs TypeScript standards" },
  },
  "react": {
    "next.js": { weight: 0.70, reason: "React component architecture translates to Next.js" },
    "javascript": { weight: 0.85, reason: "React development requires strong JavaScript foundation" },
  },
  "typescript": {
    "javascript": { weight: 0.90, reason: "TypeScript is typed JavaScript" },
  },
  "javascript": {
    "typescript": { weight: 0.65, reason: "JavaScript provides foundational syntax for TypeScript" },
    "html/css": { weight: 0.60, reason: "JavaScript web development frequently uses HTML/CSS" },
  },
  "node.js": {
    "javascript": { weight: 0.85, reason: "Node.js uses JavaScript as its core execution engine" },
    "express": { weight: 0.75, reason: "Node.js developers routinely use Express" },
    "rest api": { weight: 0.75, reason: "Node.js services implement REST APIs" },
  },
  "express": {
    "node.js": { weight: 0.90, reason: "Express is the standard web framework for Node.js" },
    "rest api": { weight: 0.85, reason: "Express is built for RESTful API routing" },
    "javascript": { weight: 0.80, reason: "Express utilizes JavaScript" },
  },
  "pandas": {
    "python": { weight: 0.80, reason: "Pandas is a core library in the Python data ecosystem" },
    "data engineering": { weight: 0.70, reason: "Pandas demonstrates data transformation and ETL skills" },
    "data science": { weight: 0.75, reason: "Pandas is fundamental for data science exploratory analysis" },
  },
  "numpy": {
    "python": { weight: 0.75, reason: "NumPy is the foundation for numerical computing in Python" },
    "data science": { weight: 0.65, reason: "NumPy arrays form the basis of ML data pipelines" },
  },
  "scikit-learn": {
    "machine learning": { weight: 0.90, reason: "Scikit-Learn is the standard machine learning library" },
    "python": { weight: 0.80, reason: "Scikit-Learn implies Python ecosystem fluency" },
    "data science": { weight: 0.80, reason: "Scikit-Learn covers core data modeling" },
  },
  "tensorflow": {
    "deep learning": { weight: 0.90, reason: "TensorFlow is an industry deep learning framework" },
    "machine learning": { weight: 0.85, reason: "TensorFlow covers broad machine learning workflows" },
    "python": { weight: 0.75, reason: "TensorFlow model development utilizes Python" },
  },
  "pytorch": {
    "deep learning": { weight: 0.90, reason: "PyTorch is an industry standard deep learning framework" },
    "machine learning": { weight: 0.85, reason: "PyTorch covers broad machine learning workflows" },
    "python": { weight: 0.75, reason: "PyTorch model development utilizes Python" },
  },
  "machine learning": {
    "deep learning": { weight: 0.65, reason: "Machine learning provides the foundational theory for deep learning" },
    "data science": { weight: 0.75, reason: "Machine learning is a core pillar of data science" },
  },
  "deep learning": {
    "machine learning": { weight: 0.85, reason: "Deep learning demonstrates mastery of advanced ML methods" },
  },
  "docker": {
    "kubernetes": { weight: 0.60, reason: "Docker containers form the foundation for Kubernetes orchestration" },
    "devops": { weight: 0.75, reason: "Docker is a standard DevOps container tool" },
  },
  "kubernetes": {
    "docker": { weight: 0.85, reason: "Kubernetes orchestration implies container runtime fluency" },
    "devops": { weight: 0.85, reason: "Kubernetes is a central DevOps orchestration platform" },
  },
  "tailwind css": {
    "css": { weight: 0.85, reason: "Tailwind CSS requires thorough CSS knowledge" },
  },
};

/**
 * Normalizes a raw skill string into a canonical skill key.
 * Handles variations (e.g. "Python 3", "Python Programming Language", "JS", "Postgres").
 * @param {string} raw
 * @returns {string} Canonical skill key or cleaned lowercase string
 */
export function normalizeSkillKey(raw = "") {
  if (!raw) return "";
  if (typeof raw === "object") {
    raw = raw.canonical || raw.name || raw.displayName || raw.skill || "";
  }
  if (!raw || typeof raw !== "string") return "";

  let cleaned = raw
    .toLowerCase()
    .trim()
    .replace(/^#+/, "")
    .replace(/\s+/g, " ")
    .replace(/["']/g, "");

  // Check direct alias
  if (SKILL_ALIASES[cleaned]) {
    return SKILL_ALIASES[cleaned];
  }

  // Handle common phrase prefixes / suffixes
  const strippedPhrases = cleaned
    .replace(/\b(programming language|programming|language|framework|library|technologies|technology|skills|skill|tools|tool|developer|engineer|stack)\b/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (strippedPhrases && SKILL_ALIASES[strippedPhrases]) {
    return SKILL_ALIASES[strippedPhrases];
  }

  // Check without periods / hyphens
  const noPunct = cleaned.replace(/[-_.]/g, " ").replace(/\s+/g, " ").trim();
  if (SKILL_ALIASES[noPunct]) {
    return SKILL_ALIASES[noPunct];
  }

  return cleaned;
}

/**
 * Resolves standard display name and taxonomy metadata for a skill.
 * @param {string} skillName
 * @returns {object} { canonical, displayName, category, domain, criticality }
 */
export function resolveSkillMetadata(skillName = "") {
  const canonical = normalizeSkillKey(skillName);
  const def = SKILL_DEFINITIONS[canonical] || {};

  return {
    canonical,
    displayName: def.name || (skillName ? skillName.trim() : "Skill"),
    category: def.category || "Technical Skill",
    domain: def.domain || "General Engineering",
    criticality: def.criticality || "STANDARD",
  };
}
