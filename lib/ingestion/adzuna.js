import { env } from "@/lib/config/env";
import { normalizeOpportunity } from "@/lib/ingestion/normalize";

/**
 * Fetches software developer jobs from Adzuna API (requires ADZUNA_APP_ID & ADZUNA_APP_KEY).
 * @returns {Promise<object[]>}
 */
export async function fetchAdzunaJobs() {
  if (!env.adzuna.appId || !env.adzuna.appKey) {
    return [];
  }

  try {
    const url = `https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=${env.adzuna.appId}&app_key=${env.adzuna.appKey}&what=software%20developer&results_per_page=15&content-type=application/json`;
    const res = await fetch(url, { next: { revalidate: 3600 } });

    if (!res.ok) {
      console.warn(`Adzuna API responded with status ${res.status}`);
      return [];
    }

    const data = await res.json();
    const results = data.results || [];

    return results.map((item) =>
      normalizeOpportunity(
        {
          id: item.id,
          title: item.title,
          company: item.company?.display_name,
          location: item.location?.display_name,
          salary_min: item.salary_min,
          description: item.description,
          url: item.redirect_url,
        },
        "Adzuna"
      )
    );
  } catch (err) {
    console.warn("Adzuna ingestion fallback:", err.message);
    return [];
  }
}
