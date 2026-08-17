import { generateTailoredOpportunities } from "../lib/opportunities/opportunityService.js";
import { getMatchingFeatures } from "../lib/matching/getMatchingFeatures.js";
import { calculateMatchScore } from "../lib/matching/scoring.js";

const testSkills = ["React", "Tailwind CSS", "TypeScript", "Next.js"];
const matchingFeatures = getMatchingFeatures({ skills: testSkills }, []);
const opps = generateTailoredOpportunities(testSkills);

console.log(`Generated ${opps.length} opportunities for skills:`, testSkills);

opps.slice(0, 3).forEach((opp, i) => {
  const scoreResult = calculateMatchScore(matchingFeatures, opp.requiredSkills);
  console.log(`\nOpp #${i + 1}: ${opp.title} @ ${opp.company}`);
  console.log(`Work Mode: ${opp.workMode} | Location: ${opp.location}`);
  console.log(`Stipend: ${opp.stipend}`);
  console.log(`Required Skills: ${opp.requiredSkills.join(", ")}`);
  console.log(`Score: ${scoreResult.score}% (Coverage: ${scoreResult.coverageRatio})`);
  console.log(`Matched Skills:`, scoreResult.matchedSkills.map(m => m.name));
  console.log(`Missing Skills:`, scoreResult.missingSkills.map(m => m.name));
});
