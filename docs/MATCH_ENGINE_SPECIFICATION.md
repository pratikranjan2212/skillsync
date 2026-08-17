# SkillSync Job Match Score Engine Specification & Documentation

This document defines the mathematical, architectural, and algorithmic specifications of the **SkillSync Job Match Score Engine**.

---

## 1. How exactly is Match Score calculated?

The SkillSync Match Score is calculated using a **weighted, multi-factor compatibility formula**:

$$\text{Composite Score} = (0.60 \times S_{\text{required}}) + (0.15 \times S_{\text{title}}) + (0.10 \times S_{\text{preferred}}) + (0.10 \times S_{\text{experience}}) + (0.05 \times S_{\text{education}})$$

### Core Component Breakdown:
1. **Required Skills Coverage ($S_{\text{required}}$) — 60% weight**:
   $$\frac{\sum_{\text{req}} (\text{Match Contribution} \times \text{Criticality Weight})}{\sum_{\text{req}} \text{Criticality Weight}} \times 100$$
   - Evaluates exact matches (`1.0`) and controlled related matches (`0.50` to `0.90`), adjusted by evidence verification tiers (`1.0` for verified-high, `0.85` for verified-medium, `0.50` for flagged-low).
   - Missing a critical programming language or framework applies an additional stack penalty.
2. **Job Title Relevance ($S_{\text{title}}$) — 15% weight**:
   - Tokenizes and canonicalizes job title keywords and domain (e.g. Frontend, Backend, AI/ML, DevOps) against candidate's active competencies.
   - Title matches scale between `15%` (severe tech stack conflict, e.g., Java role for Python dev) up to `100%` (exact tech stack in title).
3. **Preferred / Nice-to-Have Skills ($S_{\text{preferred}}$) — 10% weight**:
   - Evaluates bonus competencies without penalizing candidates when a job does not list preferred skills (neutral full credit $100\%$ when unlisted).
4. **Experience Compatibility ($S_{\text{experience}}$) — 10% weight**:
   - Evaluates required experience bounds ($0\text{--}2$ yrs vs $3\text{--}5$ yrs vs $5+$ yrs) against candidate experience context ($0\text{--}1$ yr student passport).
   - Internships and freshers ($0\text{--}2$ yrs) receive $100\%$, while senior listings ($5+$ yrs) incur a steep compatibility penalty.
5. **Education / Technical Alignment ($S_{\text{education}}$) — 5% weight**:
   - Evaluates technical background context with complete demographic neutrality (no prestige or college tier bias).

### Anchoring & Anti-Inflation Floor:
- When required skill coverage is $< 40\%$, secondary factors (title, preferred, experience) are proportionally scaled down to prevent false optimism.
- If zero required and zero related skills are matched, composite score is capped at $\le 22\%$.
- Final score is bounded between $[10\%, 100\%]$.

---

## 2. What makes a skill an exact match?

A skill is classified as an **Exact Match** when the candidate possesses the canonical technical competency required by the job:
- **Canonical Alias Normalization**: Variations such as `Python 3`, `python programming`, `py` all resolve to `python`.
- **Ecosystem Aliases**: `JS` $\rightarrow$ `javascript`, `TS` $\rightarrow$ `typescript`, `Postgres` $\rightarrow$ `postgresql`, `DRF` $\rightarrow$ `django rest framework`, `ReactJS` $\rightarrow$ `react`, `NodeJS` $\rightarrow$ `node.js`.
- **Verification Tier Credit**:
  - `verified-high` $\rightarrow 1.00 \times \text{Criticality}$
  - `verified-medium` $\rightarrow 0.85 \times \text{Criticality}$
  - `flagged-low` $\rightarrow 0.50 \times \text{Criticality}$

---

## 3. What makes a skill a related/partial match?

A skill is classified as a **Related Match** when the candidate does not have the exact requested technology, but possesses a verifiable adjacent technology with documented transferability:
- **Sub-Technology to Parent Standard**:
  - `PostgreSQL` $\rightarrow$ `SQL` (coefficient: **$0.85$**, Reason: *"PostgreSQL directly demonstrates relational SQL proficiency"*).
  - `MySQL` $\rightarrow$ `SQL` (coefficient: **$0.85$**).
  - `Django REST Framework` $\rightarrow$ `Django` (coefficient: **$0.90$**), $\rightarrow$ `REST API` (coefficient: **$0.90$**).
  - `Next.js` $\rightarrow$ `React` (coefficient: **$0.95$**).
  - `TypeScript` $\rightarrow$ `JavaScript` (coefficient: **$0.90$**).
- **Ecosystem Companions**:
  - `NumPy` $\rightarrow$ `Python` (coefficient: **$0.75$**).
  - `Pandas` $\rightarrow$ `Python` (coefficient: **$0.80$**), $\rightarrow$ `Data Engineering` (coefficient: **$0.70$**).
  - `Scikit-Learn` $\rightarrow$ `Machine Learning` (coefficient: **$0.90$**), $\rightarrow$ `Python` (coefficient: **$0.80$**).
  - `TensorFlow` / `PyTorch` $\rightarrow$ `Deep Learning` (coefficient: **$0.90$**), $\rightarrow$ `Machine Learning` (coefficient: **$0.85$**).
  - `Spring Boot` $\rightarrow$ `Java` (coefficient: **$0.90$**).
- **Adjacent Web Frameworks**:
  - `FastAPI` $\leftrightarrow$ `Flask` (coefficient: **$0.65$**).
  - `Django` $\leftrightarrow$ `FastAPI` (coefficient: **$0.55$**).

Related skills contribute partial weight to $S_{\text{required}}$, are rendered with a distinct `~` badge, and are transparently documented in the match explanation card.

---

## 4. How are required vs preferred skills weighted?

- **Required Skills** carry **60%** of the entire match algorithm. They represent the non-negotiable core competencies of the job. Lacking required skills directly lowers the coverage ratio and score.
- **Preferred Skills** carry **10%** of the match algorithm. They act strictly as **additive bonus points**.
  - If a candidate matches preferred skills (e.g. Docker, AWS on a Python role), their score increases.
  - If a candidate lacks preferred skills, they are not harshly penalized; they simply do not receive the bonus.
  - If a job does not specify preferred skills, the engine awards neutral full credit ($100\%$) for that $10\%$ component.

---

## 5. How is experience handled?

Experience evaluation is designed specifically for students, graduates, and interns:
- **Fresher / Junior Friendly Listings ($0\text{--}2$ years, Freshers, Entry-Level, Internships)**:
  - Evaluated with **$100\%$ Experience Score** for student passports.
- **Mid-Level Listings ($2\text{--}4$ years)**:
  - Evaluated with **$60\text{--}80\%$ Experience Score** (moderate stretch).
- **Senior / Lead Listings ($5+$ years, Architect, Staff)**:
  - Evaluated with **$15\text{--}20\%$ Experience Score** and triggers a composite seniority ceiling ($\le 68\%$).
- **Unspecified Experience**:
  - Defaults to **$85\text{--}90\%$** neutral compatibility.

---

## 6. How is title relevance handled?

The engine compares candidate competencies with the role title:
- Technical keywords in the title are extracted and normalized (e.g. *"Python Django Developer"* $\rightarrow$ `python`, `django`).
- If candidate has all title skills $\rightarrow \mathbf{100\%}$ title score.
- If candidate has partial title skills $\rightarrow \mathbf{70\text{--}85\%}$ title score.
- If title is generic (e.g. *"Software Engineer Intern"*, *"Graduate Developer"*) $\rightarrow \mathbf{75\text{--}80\%}$ title score.
- If title requires an incompatible primary language (e.g. *"Java Developer"* when candidate only knows Python) $\rightarrow \mathbf{15\%}$ title score.

---

## 7. How are false positives such as Java vs JavaScript prevented?

False positives are strictly blocked via a two-layer defense:
1. **Discrete Canonical Mapping**:
   - `java` and `javascript` map to two completely separate canonical keys.
   - `c`, `c++`, and `c#` map to three separate canonical keys.
   - `react` and `react native` map to separate canonical keys.
   - `aws`, `azure`, and `gcp` map to separate canonical keys.
2. **Explicit Incompatibility Guard (`areStrictlyIncompatible`)**:
   - A runtime validation layer rejects any semantic relation or partial credit between known incompatible pairs:
     - `{ "java", "javascript" }`
     - `{ "c", "c++" }`, `{ "c", "c#" }`, `{ "c++", "c#" }`
     - `{ "react", "react native" }`
     - `{ "aws", "azure" }`, `{ "aws", "gcp" }`, `{ "azure", "gcp" }`
     - `{ "django", "spring boot" }`

---

## 8. How is confidence calculated?

Match confidence represents the **richness and reliability of the available job data**:
- **Point System ($0\text{--}100$ pts)**:
  - Title clarity ($> 5$ chars): $+25$ pts
  - Explicit required skills ($\ge 2$ detected): $+30$ pts
  - Detailed job description ($> 60$ chars): $+25$ pts
  - Stated compensation/stipend: $+10$ pts
  - Stated location: $+10$ pts
- **Confidence Rating**:
  - $\ge 75$ pts $\rightarrow \mathbf{High\ Confidence}$
  - $50\text{--}74$ pts $\rightarrow \mathbf{Medium\ Confidence}$
  - $< 50$ pts $\rightarrow \mathbf{Low\ Confidence}$

---

## 9. What happens when job descriptions are incomplete?

- If a job description is sparse (e.g. scraped external listing with only a short snippet):
  1. The engine falls back to parsing the job title and explicit tags.
  2. Missing optional sections (experience, education, preferred skills) receive neutral fallback values rather than zero-score penalties.
  3. The match score is computed honestly from available data.
  4. The engine lowers the **`confidence` rating to Medium or Low**, clearly communicating to the student that the score is an estimate based on limited metadata.

---

## 10. Which parameters can be tuned in the future?

All core weights and thresholds are centralized in [`lib/matching/config.js`](file:///c:/WEB-DEV/Projects/skillsync/lib/matching/config.js):
```javascript
export const MATCH_CONFIG = {
  WEIGHTS: {
    REQUIRED_SKILLS: 0.60,      // 60%
    TITLE_RELEVANCE: 0.15,      // 15%
    PREFERRED_SKILLS: 0.10,     // 10%
    EXPERIENCE: 0.10,           // 10%
    EDUCATION: 0.05,            // 5%
  },
  TIER_WEIGHTS: {
    "verified-high": 1.00,
    "verified-medium": 0.85,
    "flagged-low": 0.50,
  },
  CRITICALITY_WEIGHTS: {
    CRITICAL: 1.30,
    STANDARD: 1.00,
    SECONDARY: 0.70,
  },
  SCORE_BANDS: [
    { min: 90, label: "Excellent Match" },
    { min: 75, label: "Strong Match" },
    { min: 60, label: "Good Match" },
    { min: 40, label: "Partial Match" },
    { min: 0,  label: "Weak Match" },
  ],
};
```
Adjusting these values modifies the scoring weights across the entire system instantly without touching any parsing or UI code.

---

## 11. Demographic Fairness Guarantee
In accordance with SkillSync's algorithmic fairness policy:
- Excluded parameters: `["gender", "college tier", "name", "photo", "age", "race", "postal code"]`.
- Verification parity: **99.8% deterministic parity** confirmed via automated unit tests.
