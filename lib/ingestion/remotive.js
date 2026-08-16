import { normalizeOpportunity } from "@/lib/ingestion/normalize";

/**
 * Fetches software engineering jobs from Remotive API (No API key needed).
 * @returns {Promise<object[]>}
 */
export async function fetchRemotiveJobs() {
  try {
    const res = await fetch("https://remotive.com/api/remote-jobs?category=software-dev&limit=15", {
      next: { revalidate: 3600 },
      headers: { "User-Agent": "SkillSync-JobIngestion/1.0" },
    });

    if (!res.ok) {
      console.warn(`Remotive API responded with status ${res.status}`);
      return [];
    }

    const data = await res.json();
    const jobs = data.jobs || [];

    return jobs.map((job) => normalizeOpportunity(job, "Remotive"));
  } catch (err) {
    console.warn("Remotive ingestion fallback:", err.message);
    return [];
  }
}
