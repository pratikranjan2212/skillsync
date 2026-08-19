/**
 * SkillSync Bot & Automated Script Protection Engine
 * Detects known malicious scanners, scraping bots, path probing, and honeypot traps.
 */

// Known vulnerability scanners, exploit scrapers, and aggressive automated CLI tools
const BLOCKED_USER_AGENTS = [
  /sqlmap/i,
  /nikto/i,
  /masscan/i,
  /dirbuster/i,
  /gobuster/i,
  /acunetix/i,
  /nessus/i,
  /nmap/i,
  /havij/i,
  /w3af/i,
  /zgrab/i,
  /libwww-perl/i,
  /scrapy/i,
  /python-requests\//i, // Bare automated python requests library without proper identification
  /aiohttp/i,
  /httpclient/i,
  /go-http-client/i,
  /censys/i,
  /shodan/i,
];

// Dangerous path patterns probed by automated scanners
const MALICIOUS_PATH_PATTERNS = [
  /\/\.env/i,
  /\/\.git/i,
  /\/\.aws/i,
  /\/\.docker/i,
  /\/wp-admin/i,
  /\/wp-login/i,
  /\/xmlrpc\.php/i,
  /\/phpinfo/i,
  /\/phpmyadmin/i,
  /\/eval-stdin\.php/i,
  /\/actuator\/health/i,
  /\/cgi-bin\//i,
  /\/\.well-known\/(?!pki-validation)/i,
  /\/\.ds_store/i,
  /\/web\.config/i,
];

/**
 * Validates if incoming User-Agent is an automated vulnerability scanner or unauthorized scraping tool.
 * @param {string} userAgent
 * @returns {{ isBot: boolean, reason?: string }}
 */
export function isMaliciousUserAgent(userAgent) {
  if (!userAgent || typeof userAgent !== "string") {
    // Missing user-agent from an automated client
    return { isBot: true, reason: "Missing or empty User-Agent header" };
  }

  for (const pattern of BLOCKED_USER_AGENTS) {
    if (pattern.test(userAgent)) {
      return { isBot: true, reason: `Blocked scanner or scraper signature: ${pattern}` };
    }
  }

  return { isBot: false };
}

/**
 * Checks if request is probing known sensitive or vulnerability exploitation paths.
 * @param {string} pathname
 * @returns {boolean}
 */
export function isProbingRestrictedPaths(pathname) {
  if (!pathname || typeof pathname !== "string") return false;
  return MALICIOUS_PATH_PATTERNS.some((pattern) => pattern.test(pathname));
}

/**
 * Validates a honeypot field in form submissions.
 * Legitimate users leave the hidden honeypot empty; bots auto-fill it.
 *
 * @param {object} body
 * @param {string} honeypotFieldName
 * @returns {boolean} True if clean, False if bot triggered
 */
export function validateHoneypot(body, honeypotFieldName = "website_hp") {
  if (!body || typeof body !== "object") return true;
  const val = body[honeypotFieldName];
  // If honeypot is present and non-empty, it's a bot submission
  return !val || String(val).trim() === "";
}
