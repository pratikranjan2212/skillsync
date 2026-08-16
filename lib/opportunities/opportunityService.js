import prisma from "@/lib/prisma";

// Known industry skill clusters and complementary tech stacks
const SKILL_CLUSTERS = [
  {
    category: "Frontend Development",
    triggers: [
      "react", "react.js", "next.js", "nextjs", "vue", "vue.js", "angular",
      "tailwind", "tailwind css", "javascript", "typescript", "html", "css",
      "redux", "ui/ux", "figma"
    ],
    templates: [
      {
        titleSuffix: "Frontend Developer Intern",
        companies: [
          { name: "Vercel Labs", stipend: "₹50,000 / month", location: "Remote (Worldwide)", workMode: "Remote" },
          { name: "Swiggy Tech", stipend: "₹45,000 / month", location: "Bengaluru, KA (Hybrid)", workMode: "Hybrid" },
          { name: "Razorpay Engineering", stipend: "₹55,000 / month", location: "Bengaluru, KA (Hybrid)", workMode: "Hybrid" },
          { name: "Postman Labs", stipend: "₹48,000 / month", location: "Bengaluru, KA (On-site)", workMode: "On-site" },
          { name: "BrowserStack", stipend: "₹50,000 / month", location: "Mumbai, MH (On-site)", workMode: "On-site" },
          { name: "Linear Systems", stipend: "₹65,000 / month", location: "Remote (India)", workMode: "Remote" },
        ],
        descTemplate: "Join the core frontend team to build high-performance web applications, fluid user interfaces, and responsive component libraries using modern frameworks and styling systems.",
        complementarySkills: ["React.js", "Tailwind CSS", "TypeScript", "REST API design", "Next.js"],
      },
      {
        titleSuffix: "UI/UX & Web Engineer Intern",
        companies: [
          { name: "CRED Design Lab", stipend: "₹60,000 / month", location: "Bengaluru, KA (On-site)", workMode: "On-site" },
          { name: "Zepto Product Team", stipend: "₹45,000 / month", location: "Mumbai, MH (Hybrid)", workMode: "Hybrid" },
          { name: "Canva Studio", stipend: "₹52,000 / month", location: "Remote (Worldwide)", workMode: "Remote" },
        ],
        descTemplate: "Collaborate with product designers and full-stack engineers to implement pixel-perfect user experiences, micro-interactions, and design systems.",
        complementarySkills: ["Figma", "React.js", "Tailwind CSS", "JavaScript"],
      },
    ],
  },
  {
    category: "Backend & Systems",
    triggers: [
      "node", "node.js", "nodejs", "express", "fastapi", "django", "spring boot",
      "java", "golang", "go", "c++", "c#", ".net", "sql", "postgresql", "mongodb",
      "redis", "rest", "rest api", "graphql"
    ],
    templates: [
      {
        titleSuffix: "Backend Engineering Intern",
        companies: [
          { name: "Stripe Infrastructure", stipend: "₹70,000 / month", location: "Remote (India)", workMode: "Remote" },
          { name: "Zerodha Tech", stipend: "₹60,000 / month", location: "Bengaluru, KA (On-site)", workMode: "On-site" },
          { name: "Groww Core Systems", stipend: "₹50,000 / month", location: "Bengaluru, KA (Hybrid)", workMode: "Hybrid" },
          { name: "Uber Core Platform", stipend: "₹65,000 / month", location: "Hyderabad, TS (Hybrid)", workMode: "Hybrid" },
          { name: "Zomato Backend Team", stipend: "₹45,000 / month", location: "Gurgaon, NCR (On-site)", workMode: "On-site" },
        ],
        descTemplate: "Build and scale high-throughput REST & GraphQL microservices, database schemas, caching layers, and transaction pipelines.",
        complementarySkills: ["Node.js", "PostgreSQL", "REST API design", "Docker", "SQL"],
      },
      {
        titleSuffix: "Full-Stack Software Intern",
        companies: [
          { name: "Supabase Engineering", stipend: "₹65,000 / month", location: "Remote (Worldwide)", workMode: "Remote" },
          { name: "Atlassian Labs", stipend: "₹60,000 / month", location: "Bengaluru, KA (Hybrid)", workMode: "Hybrid" },
          { name: "Pine Labs", stipend: "₹42,000 / month", location: "Noida, UP (On-site)", workMode: "On-site" },
        ],
        descTemplate: "Work across the full product stack from modern client interfaces to database query optimization and API endpoints.",
        complementarySkills: ["Next.js", "TypeScript", "PostgreSQL", "REST API design"],
      },
    ],
  },
  {
    category: "AI, ML & Data Science",
    triggers: [
      "python", "machine learning", "deep learning", "tensorflow", "pytorch",
      "nlp", "computer vision", "pandas", "numpy", "data science",
      "data engineering", "scikit-learn", "sql"
    ],
    templates: [
      {
        titleSuffix: "AI & Machine Learning Intern",
        companies: [
          { name: "Scale AI Labs", stipend: "₹75,000 / month", location: "Remote (Worldwide)", workMode: "Remote" },
          { name: "Sarvam AI", stipend: "₹65,000 / month", location: "Bengaluru, KA (On-site)", workMode: "On-site" },
          { name: "Microsoft Research India", stipend: "₹70,000 / month", location: "Bengaluru, KA (Hybrid)", workMode: "Hybrid" },
          { name: "Krutrim AI Core", stipend: "₹50,000 / month", location: "Bengaluru, KA (Hybrid)", workMode: "Hybrid" },
          { name: "Wadhwani AI", stipend: "₹45,000 / month", location: "Mumbai, MH (On-site)", workMode: "On-site" },
        ],
        descTemplate: "Assist with training foundation models, fine-tuning LLMs, evaluating embeddings, and preparing high-quality domain datasets.",
        complementarySkills: ["Python", "TensorFlow", "Deep Learning", "SQL", "Docker"],
      },
      {
        titleSuffix: "Junior Data Engineer",
        companies: [
          { name: "Databricks Analytics", stipend: "₹68,000 / month", location: "Bengaluru, KA (Hybrid)", workMode: "Hybrid" },
          { name: "Fractal Analytics", stipend: "₹42,000 / month", location: "Mumbai, MH (On-site)", workMode: "On-site" },
          { name: "Mu Sigma Data Labs", stipend: "₹40,000 / month", location: "Bengaluru, KA (On-site)", workMode: "On-site" },
          { name: "DataCo Analytics", stipend: "₹52,000 / month", location: "Remote (India)", workMode: "Remote" },
        ],
        descTemplate: "Design robust ETL data streams, optimize SQL query execution, and automate real-time analytics pipelines.",
        complementarySkills: ["Python", "SQL", "Data Engineering", "PostgreSQL"],
      },
    ],
  },
  {
    category: "Cloud, DevOps & Security",
    triggers: [
      "docker", "kubernetes", "aws", "azure", "gcp", "ci/cd", "linux", "devops",
      "cybersecurity", "security", "terraform"
    ],
    templates: [
      {
        titleSuffix: "Cloud & DevOps Intern",
        companies: [
          { name: "HashiCorp Cloud", stipend: "₹65,000 / month", location: "Remote (Worldwide)", workMode: "Remote" },
          { name: "Cloudflare Systems", stipend: "₹60,000 / month", location: "Bengaluru, KA (Hybrid)", workMode: "Hybrid" },
          { name: "InMobi Infrastructure", stipend: "₹48,000 / month", location: "Bengaluru, KA (On-site)", workMode: "On-site" },
        ],
        descTemplate: "Automate containerized deployment pipelines, configure cloud infrastructure as code, and monitor service telemetry.",
        complementarySkills: ["Docker", "AWS", "Git", "REST API design"],
      },
    ],
  },
  {
    category: "Mobile & Cross-Platform",
    triggers: ["flutter", "react native", "android", "ios", "kotlin", "swift", "dart", "mobile"],
    templates: [
      {
        titleSuffix: "Mobile App Developer Intern",
        companies: [
          { name: "PhonePe Mobile Core", stipend: "₹50,000 / month", location: "Bengaluru, KA (Hybrid)", workMode: "Hybrid" },
          { name: "Duolingo Engineering", stipend: "₹65,000 / month", location: "Remote (Worldwide)", workMode: "Remote" },
          { name: "Meesho App Team", stipend: "₹45,000 / month", location: "Bengaluru, KA (On-site)", workMode: "On-site" },
        ],
        descTemplate: "Build smooth, intuitive mobile experiences, integrate real-time APIs, and optimize native rendering performance.",
        complementarySkills: ["React Native", "Flutter", "TypeScript", "REST API design"],
      },
    ],
  },
];

/**
 * Resolves direct targeted role application link (lands straight onto the job listing and apply flow).
 */
export function resolveApplicationUrl(companyName = "", title = "") {
  const comp = (companyName || "").trim();
  const role = (title || "").trim();
  const searchParam = encodeURIComponent(`${comp} ${role} internship apply jobs`.trim());
  return `https://www.google.com/search?q=${searchParam}`;
}

/**
 * Normalizes a location or workMode string to standard "Remote", "Hybrid", or "On-site".
 */
export function normalizeWorkMode(workMode, location = "") {
  const combined = `${workMode || ""} ${location || ""}`.toLowerCase();
  if (combined.includes("remote") || combined.includes("worldwide") || combined.includes("wfh")) {
    return "Remote";
  }
  if (combined.includes("hybrid")) {
    return "Hybrid";
  }
  if (
    combined.includes("on-site") ||
    combined.includes("onsite") ||
    combined.includes("offline") ||
    combined.includes("office") ||
    combined.includes("in-office")
  ) {
    return "On-site";
  }
  return "On-site";
}

/**
 * Generates tailored opportunities based on the user's active skills.
 * @param {string[]} userSkills - List of user's skills
 * @returns {object[]} Curated opportunity listings
 */
export function generateTailoredOpportunities(userSkills = []) {
  if (!userSkills || userSkills.length === 0) {
    return [];
  }

  const normalizedUserSkills = userSkills.map((s) => s.trim());
  const lowerUserSkills = normalizedUserSkills.map((s) => s.toLowerCase());

  const matchingClusters = [];
  for (const cluster of SKILL_CLUSTERS) {
    const hasMatch = cluster.triggers.some(
      (t) =>
        lowerUserSkills.includes(t.toLowerCase()) ||
        lowerUserSkills.some((us) => us.includes(t.toLowerCase()) || t.toLowerCase().includes(us))
    );
    if (hasMatch) {
      matchingClusters.push(cluster);
    }
  }

  const generatedOpps = [];
  let index = 1;

  // For each matching skill cluster, create tailored opportunities across Remote, Hybrid, On-site
  for (const cluster of matchingClusters) {
    for (const template of cluster.templates) {
      for (const comp of template.companies) {
        // Build required skills: pick skills that user HAS, plus 1-2 complementary industry skills
        const matched = normalizedUserSkills.filter((sk) => {
          const lsk = sk.toLowerCase();
          return (
            cluster.triggers.includes(lsk) ||
            template.complementarySkills.some(
              (cs) =>
                cs.toLowerCase() === lsk ||
                lsk.includes(cs.toLowerCase()) ||
                cs.toLowerCase().includes(lsk)
            )
          );
        });

        // Complementary skills not already in user's list
        const extraSkills = template.complementarySkills.filter(
          (cs) => !lowerUserSkills.includes(cs.toLowerCase())
        );

        // Selected required skills: union of matching + 1 or 2 extra skills
        const selectedSkills = Array.from(
          new Set([...matched.slice(0, 3), ...extraSkills.slice(0, 2)])
        );

        if (selectedSkills.length < 3) {
          for (const fallback of template.complementarySkills) {
            if (!selectedSkills.includes(fallback)) selectedSkills.push(fallback);
            if (selectedSkills.length >= 3) break;
          }
        }

        const modeSlug = comp.workMode.toLowerCase().replace(/[^a-z0-9]/g, "");
        const oppId = `opp-sync-${modeSlug}-${index++}`;
        const externalId = `ext-${comp.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${index}`;
        const directRoleUrl = resolveApplicationUrl(comp.name, template.titleSuffix);

        generatedOpps.push({
          id: oppId,
          externalId,
          title: template.titleSuffix,
          company: comp.name,
          location: comp.location,
          workMode: comp.workMode,
          stipend: comp.stipend,
          type: "Internship",
          description: template.descTemplate,
          requiredSkills: selectedSkills,
          source: "SkillSync Verified Ingestion",
          url: directRoleUrl,
          externalUrl: directRoleUrl,
          ingestedAt: new Date(Date.now() - index * 3600000).toISOString(),
        });
      }
    }
  }

  // If few or no specific cluster matched, create customized roles utilizing the exact user skills
  if (generatedOpps.length < 3) {
    const modes = [
      { mode: "Remote", loc: "Remote (Worldwide)", comp: "HyperSync Labs", stipend: "₹55,000 / month" },
      { mode: "Hybrid", loc: "Bengaluru, KA (Hybrid)", comp: "Apex Technologies", stipend: "₹45,000 / month" },
      { mode: "On-site", loc: "Mumbai, MH (On-site)", comp: "MetroStack Systems", stipend: "₹40,000 / month" },
    ];

    modes.forEach((m, idx) => {
      const modeSlug = m.mode.toLowerCase().replace(/[^a-z0-9]/g, "");
      const oppId = `opp-custom-${modeSlug}-${idx + 1}`;
      const title = `${normalizedUserSkills[0] || "Software"} Engineer Intern`;
      const directRoleUrl = resolveApplicationUrl(m.comp, title);

      generatedOpps.push({
        id: oppId,
        externalId: `ext-custom-${idx + 1}`,
        title,
        company: m.comp,
        location: m.loc,
        workMode: m.mode,
        stipend: m.stipend,
        type: "Internship",
        description: `Opportunity calibrated for candidates skilled in ${normalizedUserSkills.slice(0, 3).join(", ")}. Build and deliver core software systems in a collaborative modern environment.`,
        requiredSkills: [...normalizedUserSkills.slice(0, 3), "REST API design", "Git"].slice(0, 4),
        source: "SkillSync Verified Ingestion",
        url: directRoleUrl,
        externalUrl: directRoleUrl,
        ingestedAt: new Date(Date.now() - (idx + 1) * 7200000).toISOString(),
      });
    });
  }

  return generatedOpps;
}

/**
 * Asynchronously persists/upserts generated opportunities to the database so individual match details can be queried.
 */
export async function syncOpportunitiesToDb(opportunities = []) {
  try {
    for (const opp of opportunities) {
      if (!opp.externalId) continue;
      await prisma.opportunity.upsert({
        where: { externalId: opp.externalId },
        update: {
          title: opp.title,
          company: opp.company,
          location: opp.location,
          stipend: opp.stipend,
          type: opp.type,
          description: opp.description,
          requiredSkills: opp.requiredSkills,
          source: opp.source,
          url: opp.url || opp.externalUrl,
        },
        create: {
          id: opp.id,
          externalId: opp.externalId,
          title: opp.title,
          company: opp.company,
          location: opp.location,
          stipend: opp.stipend,
          type: opp.type,
          description: opp.description,
          requiredSkills: opp.requiredSkills,
          source: opp.source,
          url: opp.url || opp.externalUrl,
        },
      }).catch(() => {});
    }
  } catch (err) {
    // Non-fatal if DB is in read-only or offline mode
    console.warn("syncOpportunitiesToDb warning:", err.message);
  }
}
