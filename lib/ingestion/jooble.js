import { env } from "@/lib/config/env";
import { normalizeOpportunity } from "@/lib/ingestion/normalize";

/**
 * Fetches software jobs from Jooble API (requires JOOBLE_API_KEY).
 * @returns {Promise<object[]>}
 */
export async function fetchJoobleJobs() {
  if (!env.joobleApiKey) {
    return [];
  }

  try {
    const res = await fetch(`https://jooble.org/api/${env.joobleApiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        keywords: "software engineer intern",
        location: "India",
      }),
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.warn(`Jooble API responded with status ${res.status}`);
      return [];
    }

    const data = await res.json();
    const jobs = data.jobs || [];

    return jobs.map((job) =>
      normalizeOpportunity(
        {
          id: job.id,
          title: job.title,
          company: job.company,
          location: job.location,
          salary: job.salary,
          type: job.type,
          description: job.snippet,
          url: job.link,
        },
        "Jooble"
      )
    );
  } catch (err) {
    console.warn("Jooble ingestion fallback:", err.message);
    return [];
  }
}
