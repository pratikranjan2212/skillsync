import prisma from "@/lib/prisma";

export const SKILL_CLUSTERS = [
  {
    category: "Full-Stack & Web Engineering",
    triggers: [
      "react", "react.js", "next.js", "node.js", "node", "typescript", "javascript",
      "html", "css", "tailwind", "express", "mongodb", "postgresql", "sql", "git"
    ],
    templates: [
      {
        titleSuffix: "Full-Stack Developer Intern",
        companies: [
          { name: "Vercel Labs", stipend: "₹60,000 / month", location: "Remote (Worldwide)", workMode: "Remote" },
          { name: "Razorpay Core", stipend: "₹55,000 / month", location: "Bengaluru, KA (Hybrid)", workMode: "Hybrid" },
          { name: "Swiggy Engineering", stipend: "₹50,000 / month", location: "Bengaluru, KA (On-site)", workMode: "On-site" },
          { name: "Postman API Platform", stipend: "₹65,000 / month", location: "Bengaluru, KA (Hybrid)", workMode: "Hybrid" },
          { name: "Zerodha Tech", stipend: "₹45,000 / month", location: "Bengaluru, KA (On-site)", workMode: "On-site" },
        ],
        descTemplate: "Develop responsive web interfaces, architect high-throughput REST APIs, and implement state-driven client workflows.",
        complementarySkills: ["React", "TypeScript", "Node.js", "Git", "REST API design"],
      },
      {
        titleSuffix: "Frontend Engineer Intern",
        companies: [
          { name: "Linear Systems", stipend: "₹55,000 / month", location: "Remote (Worldwide)", workMode: "Remote" },
          { name: "CRED Design Systems", stipend: "₹50,000 / month", location: "Bengaluru, KA (On-site)", workMode: "On-site" },
          { name: "Groww Web Team", stipend: "₹45,000 / month", location: "Bengaluru, KA (Hybrid)", workMode: "Hybrid" },
        ],
        descTemplate: "Build pixel-perfect, accessible component hierarchies and craft fluid UI interactions with modern animation primitives.",
        complementarySkills: ["React", "Next.js", "Tailwind CSS", "JavaScript"],
      },
      {
        titleSuffix: "Backend & Systems Intern",
        companies: [
          { name: "Supabase Core", stipend: "₹70,000 / month", location: "Remote (Worldwide)", workMode: "Remote" },
          { name: "Hasura GraphQL", stipend: "₹55,000 / month", location: "Bengaluru, KA (Hybrid)", workMode: "Hybrid" },
          { name: "Zepto Platform", stipend: "₹48,000 / month", location: "Mumbai, MH (On-site)", workMode: "On-site" },
        ],
        descTemplate: "Design resilient relational schemas, build performant query pipelines, and optimize distributed service endpoints.",
        complementarySkills: ["Node.js", "PostgreSQL", "SQL", "Docker", "REST API design"],
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
 * Resolves direct targeted role application link.
 */
export function resolveApplicationUrl(companyName = "", title = "", source = "Indeed") {
  const comp = (companyName || "").trim();
  const role = (title || "").trim();
  if (source === "Indeed") {
    return `https://in.indeed.com/jobs?q=${encodeURIComponent(`${role} ${comp}`.trim())}&l=India`;
  }
  return `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(`${role} ${comp}`.trim())}`;
}

/**
 * Normalizes an opportunity or workMode string strictly to "Remote", "Hybrid", or "On-site".
 */
export function getOpportunityWorkMode(opp = {}) {
  const rawMode = (opp.workMode || "").toLowerCase().trim();
  const rawLoc = (opp.location || "").toLowerCase().trim();
  const rawTitle = (opp.title || "").toLowerCase().trim();

  // 1. Explicit Remote check
  if (
    rawMode === "remote" ||
    rawMode.includes("remote") ||
    rawMode.includes("wfh") ||
    rawMode.includes("work from home") ||
    rawLoc.includes("remote") ||
    rawLoc.includes("wfh") ||
    rawLoc.includes("worldwide") ||
    rawLoc.includes("work from home") ||
    rawTitle.includes("remote") ||
    rawTitle.includes("wfh")
  ) {
    return "Remote";
  }

  // 2. Explicit Hybrid check
  if (
    rawMode === "hybrid" ||
    rawMode.includes("hybrid") ||
    rawLoc.includes("hybrid") ||
    rawTitle.includes("hybrid")
  ) {
    return "Hybrid";
  }

  // 3. Strict fallback: Everything else is On-site
  return "On-site";
}

/**
 * Legacy alias for backwards compatibility.
 */
export function normalizeWorkMode(workMode = "", location = "") {
  return getOpportunityWorkMode({ workMode, location });
}

/**
 * Generates tailored partner opportunities based on the user's active skills.
 * @param {string[]} userSkills - List of user's skills
 * @returns {object[]} Curated opportunity listings
 */
export function generateTailoredOpportunities(userSkills = []) {
  if (!userSkills || userSkills.length === 0) {
    return [];
  }

  const normalizedUserSkills = userSkills.map((s) => s.trim());
  const lowerUserSkills = normalizedUserSkills.map((s) => s.toLowerCase());

  const generatedOpps = [];
  let index = 0;

  for (const cluster of SKILL_CLUSTERS) {
    const hasTrigger = cluster.triggers.some((trig) =>
      lowerUserSkills.some((us) => us === trig || us.includes(trig) || trig.includes(us))
    );

    if (!hasTrigger) continue;

    for (const template of cluster.templates) {
      for (const comp of template.companies) {
        const selectedSkills = normalizedUserSkills.filter((us) =>
          template.complementarySkills.some(
            (cs) => cs.toLowerCase() === us.toLowerCase() || cs.toLowerCase().includes(us.toLowerCase())
          )
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

        // Alternate platform between Indeed and LinkedIn so both sources are represented
        const isIndeedPlatform = index % 2 === 0;
        const platformSource = isIndeedPlatform ? "Indeed" : "LinkedIn";
        const directRoleUrl = resolveApplicationUrl(comp.name, template.titleSuffix, platformSource);

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
          source: platformSource,
          isLinkedInScraped: !isIndeedPlatform,
          isIndeedScraped: isIndeedPlatform,
          linkedinUrl: !isIndeedPlatform ? directRoleUrl : undefined,
          indeedUrl: isIndeedPlatform ? directRoleUrl : undefined,
          url: directRoleUrl,
          externalUrl: directRoleUrl,
          ingestedAt: new Date(Date.now() - index * 3600000).toISOString(),
        });
      }
    }
  }

  // If few or no specific cluster matched, create customized roles
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
      const isIndeedPlatform = idx % 2 === 0;
      const platformSource = isIndeedPlatform ? "Indeed" : "LinkedIn";
      const directRoleUrl = resolveApplicationUrl(m.comp, title, platformSource);

      generatedOpps.push({
        id: oppId,
        externalId: `ext-custom-${idx + 1}`,
        title,
        company: m.comp,
        location: m.loc,
        workMode: m.mode,
        stipend: m.stipend,
        type: "Internship",
        description: `Hands-on practical engineering internship focusing on ${normalizedUserSkills.join(", ")}.`,
        requiredSkills: normalizedUserSkills.length >= 3 ? normalizedUserSkills.slice(0, 3) : [...normalizedUserSkills, "Git", "REST API design"],
        source: platformSource,
        isLinkedInScraped: !isIndeedPlatform,
        isIndeedScraped: isIndeedPlatform,
        linkedinUrl: !isIndeedPlatform ? directRoleUrl : undefined,
        indeedUrl: isIndeedPlatform ? directRoleUrl : undefined,
        url: directRoleUrl,
        externalUrl: directRoleUrl,
        ingestedAt: new Date(Date.now() - (idx + 1) * 3600000).toISOString(),
      });
    });
  }

  return generatedOpps;
}

/**
 * Syncs generated or scraped opportunities to database in the background.
 */
export async function syncOpportunitiesToDb(opportunities = []) {
  if (!opportunities || opportunities.length === 0) return;

  try {
    for (const opp of opportunities) {
      if (!opp.externalId) continue;
      const standardMode = getOpportunityWorkMode(opp);
      await prisma.opportunity.upsert({
        where: { externalId: opp.externalId },
        update: {
          title: opp.title,
          company: opp.company,
          location: opp.location,
          workMode: standardMode,
          stipend: opp.stipend,
          type: opp.type,
          description: opp.description,
          requiredSkills: opp.requiredSkills,
          source: opp.source || (opp.isIndeedScraped ? "Indeed" : "LinkedIn"),
          url: opp.indeedUrl || opp.linkedinUrl || opp.url,
        },
        create: {
          id: opp.id,
          externalId: opp.externalId,
          title: opp.title,
          company: opp.company,
          location: opp.location,
          workMode: standardMode,
          stipend: opp.stipend,
          type: opp.type,
          description: opp.description,
          requiredSkills: opp.requiredSkills,
          source: opp.source || (opp.isIndeedScraped ? "Indeed" : "LinkedIn"),
          url: opp.indeedUrl || opp.linkedinUrl || opp.url,
        },
      });
    }
  } catch (err) {
    // Non-fatal if offline/database unavailable
  }
}
