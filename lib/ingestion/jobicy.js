import { normalizeOpportunity } from "@/lib/ingestion/normalize";

/**
 * Fetches developer jobs from Jobicy public API (No API key needed).
 * @returns {Promise<object[]>}
 */
export async function fetchJobicyJobs() {
  try {
    const res = await fetch("https://jobicy.com/api/v2/remote-jobs?count=15&tag=dev", {
      next: { revalidate: 3600 },
      headers: { "User-Agent": "SkillSync-JobIngestion/1.0" },
    });

    if (!res.ok) {
      console.warn(`Jobicy API responded with status ${res.status}`);
      return [];
    }

    const data = await res.json();
    const jobs = data.jobs || [];

    return jobs.map((job) => normalizeOpportunity(job, "Jobicy"));
  } catch (err) {
    console.warn("Jobicy ingestion fallback:", err.message);
    return [];
  }
}
