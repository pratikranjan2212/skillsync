import { normalizeOpportunity } from "@/lib/ingestion/normalize";

/**
 * Fetches software jobs from Arbeitnow API (No API key needed).
 * @returns {Promise<object[]>}
 */
export async function fetchArbeitnowJobs() {
  try {
    const res = await fetch("https://www.arbeitnow.com/api/job-board-api", {
      next: { revalidate: 3600 },
      headers: { "User-Agent": "SkillSync-JobIngestion/1.0" },
    });

    if (!res.ok) {
      console.warn(`Arbeitnow API responded with status ${res.status}`);
      return [];
    }

    const data = await res.json();
    const jobs = data.data || [];

    return jobs.slice(0, 15).map((job) => normalizeOpportunity(job, "Arbeitnow"));
  } catch (err) {
    console.warn("Arbeitnow ingestion fallback:", err.message);
    return [];
  }
}
