import * as cheerio from "cheerio";
import natural from "natural";

// ✅ Enhanced parseResume() Function
export function parseResume(htmlResume: string) {
  const $ = cheerio.load(htmlResume);

  // 🔎 Extract and clean text helper function
  const extractText = (selector: string) => $(selector).text().trim();

  // 🔎 Define regex for fallback name extraction
  const nameRegex = /Name:\s*([A-Z\s-]+)/i;

  let name =
    extractText("h1") ??
    extractText("p.name") ??
    extractText("strong.name") ??
    extractText("section#contact p:first-child") ??
    extractText("section#contact h2 + p") ??
    $("section#contact p:contains('Name')").text().replace(/Name:\s?/i, "").trim() ??
    nameRegex.exec($("body").text())?.[1]?.trim() ??
    null;

  // ✅ Standardize Name Extraction
  if (name) {
    name = name.replace(/(^|\s)Name:\s?/gi, "").trim();
    if (!/^[A-Za-z\s-]+$/.test(name)) {
      name = "";
    }
  }

  // ✅ Extract other fields
  const email =
    $('a[href^="mailto:"]').attr("href")?.replace("mailto:", "").trim() ??
    $("p:contains('@')").text().replace(/Email:\s?/i, "").trim() ??
    null;

  const phone =
    $('a[href^="tel:"]').attr("href")?.replace("tel:", "").trim() ??
    $("p:contains('-')").first().text().replace(/Phone:\s?/i, "").trim() ??
    null;

  const experience = extractText("section#experience, div.experience");
  const education = extractText("section#education, div.education");
  const skills = extractText("section#skills, div.skills");

  return { name, email, phone, experience, education, skills };
}

// ✅ NLP Utilities
const stemmer = natural.PorterStemmer;
const tokenizer = new natural.WordTokenizer();

// ✅ Tokenize, clean, and stem text
function tokenizeAndStem(text: string): string[] {
  return tokenizer.tokenize(text.toLowerCase()).map(word => stemmer.stem(word));
}

// ✅ Fuzzy matching using Jaro-Winkler distance
function fuzzyMatch(word1: string, word2: string, threshold = 0.88): boolean {
  return natural.JaroWinklerDistance(word1, word2) >= threshold;
}

// ✅ Expanded Synonym Mapping
const synonyms: Record<string, string[]> = {
  "ci/cd": ["continuous integration", "continuous deployment", "devops pipelines", "automation"],
  "cloud computing": ["aws", "gcp", "azure", "cloud architecture", "cloud services", "cloud security"],
  "problem-solving": ["critical thinking", "troubleshooting", "issue resolution", "debugging"],
  "security": ["IAM", "OAuth", "authentication", "RBAC", "zero trust", "cybersecurity", "SOC compliance"],
  "agile development": ["scrum", "kanban", "agile methodologies", "lean", "sprint planning", "agile workflow"],
  "machine learning": ["ML", "AI", "deep learning", "neural networks", "data science", "predictive analytics"],
  "database": ["PostgreSQL", "MongoDB", "MySQL", "NoSQL", "SQL", "databases", "data modeling"],
  "frontend": ["React.js", "Vue.js", "Angular", "frontend development", "UI/UX", "SPA frameworks"],
  "backend": ["Node.js", "Express.js", "Django", "Flask", "backend systems", "API development"],
  "microservices": ["distributed systems", "containerization", "service mesh", "API architecture", "modular services"],
  "testing": ["unit testing", "integration testing", "automated testing", "TDD", "BDD", "QA testing"],
  "orchestration": ["Kubernetes", "container orchestration", "helm", "autoscaling"],
  "identity and access management": ["IAM", "RBAC", "OAuth", "zero trust", "user authentication"],
  "continuous deployment": ["CI/CD", "automated deployment", "progressive delivery", "feature flagging"],
  "cloud security": ["SOC compliance", "SIEM", "zero trust security", "cloud-native security"],
  "big data": ["data pipelines", "ETL", "data warehousing", "real-time analytics"],
};

// ✅ Ensure softSkills and industryTerms are defined
const softSkills: string[] = [
  "leadership", "teamwork", "collaboration", "problem-solving", "communication",
  "adaptability", "mentoring", "critical thinking", "initiative", "time management",
  "decision making", "attention to detail", "negotiation", "creativity",
  "empathy", "self-motivation", "flexibility", "resilience",
  "public speaking", "persuasion", "diplomacy", "coaching"
];

const industryTerms: string[] = [
  "CI/CD", "microservices", "Kubernetes", "AWS", "GCP", "cloud computing",
  "DevOps", "agile development", "serverless", "containerization",
  "infrastructure as code", "Terraform", "Ansible", "Jenkins", "GitHub Actions",
  "monitoring", "Prometheus", "Grafana", "load balancing", "multi-cloud",
  "identity and access management (IAM)", "penetration testing",
  "automated testing", "test-driven development (TDD)", "API security",
  "machine learning operations (MLOps)", "big data", "data engineering",
  "NoSQL", "GraphQL", "Kafka", "RabbitMQ", "WebSockets", "real-time processing",
  "API gateways", "reverse proxies", "devsecops", "continuous deployment",
  "feature flagging", "helm", "docker-compose", "FinOps", "AIOps",
  "platform engineering", "edge computing solutions"
];


// ✅ Keyword Matching with Synonyms, Fuzzy & Partial Matching
function countMatches(resumeTokens: string[], jobKeywords: string[]): number {
  let matchCount = 0;

  for (const jobWord of jobKeywords) {
    const stemmedJobWord = stemmer.stem(jobWord);

    // ✅ Direct match
    if (resumeTokens.includes(stemmedJobWord)) {
      matchCount += 1;
      continue;
    }

    // ✅ Synonym match
    for (const [key, synonymsList] of Object.entries(synonyms)) {
      if (synonymsList.includes(jobWord) || key === jobWord) {
        if (resumeTokens.includes(key) || resumeTokens.some(word => synonymsList.includes(word))) {
          matchCount += 0.85; // Higher weight for synonym matches
          break;
        }
      }
    }

    // ✅ Fuzzy match (e.g., "React.js" ≈ "React")
    if (resumeTokens.some(word => fuzzyMatch(word, stemmedJobWord))) {
      matchCount += 0.75; // Boosted fuzzy match weight
    }

    // ✅ Partial substring match
    if (resumeTokens.some(word => word.includes(stemmedJobWord))) {
      matchCount += 0.5; // Slightly increased partial match weight
    }
  }

  return matchCount;
}

// ✅ Main function to match keywords, soft skills, and industry terms
export function matchKeywords(resumeText: string, jobDescription: string): {
  keywordMatch: number;
  softSkillsMatch: number;
  industryTermsMatch: number;
} {
  const jobKeywords = tokenizeAndStem(jobDescription);
  const resumeTokens = tokenizeAndStem(resumeText);

  // ✅ Count matches using enhanced algorithm
  const keywordCount = countMatches(resumeTokens, jobKeywords);
  const softSkillsCount = countMatches(resumeTokens, softSkills);
  const industryTermsCount = countMatches(resumeTokens, industryTerms);

  // ✅ Compute match scores
  const keywordMatch = (keywordCount / jobKeywords.length) * 100;
  const softSkillsMatch = (softSkillsCount / softSkills.length) * 100;
  const industryTermsMatch = (industryTermsCount / industryTerms.length) * 100;

  return { keywordMatch, softSkillsMatch, industryTermsMatch };
}

// ✅ Improved ATS Score Calculation
export function calculateATSScore(
  keywordMatch: number,
  formattingErrors: string[],
  softSkillsMatch: number,
  industryTermsMatch: number
): number {
  let keywordScore = keywordMatch * 0.45;  // 🔼 Boosted keyword weight
  let formattingPenalty = formattingErrors.length * 0.5; // 🔽 Lowered formatting penalty
  let formattingScore = Math.max(0, 10 - formattingPenalty);
  let softSkillsScore = softSkillsMatch * 1.1;  // 🔼 Major boost to soft skills
  let industryScore = industryTermsMatch * 1.2;  // 🔼 Maxed industry terms weight

  let score = keywordScore + formattingScore + softSkillsScore + industryScore;
  return Math.max(0, Math.min(score, 100)); // Cap score at 100
}
