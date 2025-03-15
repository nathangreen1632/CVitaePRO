import * as cheerio from "cheerio";
import natural from "natural";

// ✅ Enhanced parseResume() Function
// ✅ Enhanced parseResume() Function
export function parseResume(htmlResume: string) {
  const $ = cheerio.load(htmlResume);

  // 🔎 Extract and clean text helper function
  const extractText = (selector: string) => $(selector).text().trim();

  // 🔎 Improved regex for name extraction (now allows lowercase letters)
  const nameRegex = /Name:\s*([A-Za-z\s-]+)/i;

  let name: string | null =
    extractText("p:has(strong:contains('Name'))") ??
    extractText("div:has(strong:contains('Name'))") ??
    extractText("span:has(strong:contains('Name'))") ??
    extractText("p:contains('Name:')").replace(/Name:\s?/i, "").trim() ??
    extractText("div:contains('Name:')").replace(/Name:\s?/i, "").trim() ??
    nameRegex.exec($("body").text())?.[1]?.trim() ??
    null; // ✅ Fallback to `null` instead of an empty string

  // ✅ Final cleanup to ensure it's a valid name
  if (name) {
    name = name.replace(/(^|\s)Name:\s?/gi, "").trim();
    if (!/^[A-Za-z\s-]+$/.test(name)) {
      name = null; // ✅ Ensure invalid names are not used (no change needed here)
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

  const experience = extractText("h2:contains('Experience')") || extractText("section:contains('Experience')");
  const education = extractText("h2:contains('Education')") || extractText("section:contains('Education')");
  const skills = extractText("h2:contains('Skills')") || extractText("section:contains('Skills')");


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
  "ci/cd": ["continuous integration", "continuous deployment", "devops pipelines", "automation", "jenkins", "github actions", "gitlab ci", "circleci", "azure devops"],
  "cloud computing": ["aws", "gcp", "azure", "cloud architecture", "cloud services", "cloud security", "serverless", "hybrid cloud", "multi-cloud", "cloud storage"],
  "problem-solving": ["critical thinking", "troubleshooting", "issue resolution", "debugging", "root cause analysis", "diagnostic skills", "problem decomposition"],
  "security": ["IAM", "OAuth", "authentication", "RBAC", "zero trust", "cybersecurity", "SOC compliance", "encryption", "firewall", "secure coding", "PKI", "intrusion detection", "security policies"],
  "agile development": ["scrum", "kanban", "agile methodologies", "lean", "sprint planning", "agile workflow", "extreme programming", "agile ceremonies", "product backlog grooming"],
  "machine learning": ["ML", "AI", "deep learning", "neural networks", "data science", "predictive analytics", "tensorflow", "pytorch", "NLP", "reinforcement learning", "computer vision", "generative AI"],
  "database": ["PostgreSQL", "MongoDB", "MySQL", "NoSQL", "SQL", "databases", "data modeling", "ORM", "sharding", "indexing", "ACID compliance", "database replication", "OLTP", "OLAP"],
  "frontend": ["React.js", "Vue.js", "Angular", "frontend development", "UI/UX", "SPA frameworks", "Next.js", "Svelte", "Tailwind CSS", "Bootstrap", "Material UI"],
  "backend": ["Node.js", "Express.js", "Django", "Flask", "backend systems", "API development", "NestJS", "Spring Boot", "Ruby on Rails", "GoLang", "FastAPI", "GraphQL", "REST APIs"],
  "microservices": ["distributed systems", "containerization", "service mesh", "API architecture", "modular services", "event-driven architecture", "CQRS", "message queues", "service discovery"],
  "testing": ["unit testing", "integration testing", "automated testing", "TDD", "BDD", "QA testing", "jest", "mocha", "cypress", "selenium", "playwright", "pytest", "karma", "junit"],
  "orchestration": ["Kubernetes", "container orchestration", "helm", "autoscaling", "service orchestration", "k3s", "docker swarm", "nomad"],
  "identity and access management": ["IAM", "RBAC", "OAuth", "zero trust", "user authentication", "SSO", "MFA", "SAML", "OIDC", "federated identity management"],
  "continuous deployment": ["CI/CD", "automated deployment", "progressive delivery", "feature flagging", "blue-green deployment", "canary releases", "rolling updates"],
  "cloud security": ["SOC compliance", "SIEM", "zero trust security", "cloud-native security", "WAF", "cloud governance", "penetration testing"],
  "big data": ["data pipelines", "ETL", "data warehousing", "real-time analytics", "Hadoop", "Spark", "Flink", "Kafka", "Druid", "Redshift"],
  "observability": ["monitoring", "logging", "tracing", "metrics", "Prometheus", "Grafana", "ELK stack", "New Relic", "Datadog", "OpenTelemetry"],
  "containerization": ["Docker", "Podman", "LXC", "container runtime", "image registries", "Docker Compose"],
  "devops": ["infrastructure as code", "Terraform", "Ansible", "Puppet", "Chef", "config management", "site reliability engineering"],
  "networking": ["DNS", "load balancing", "reverse proxies", "TCP/IP", "HTTP/2", "TLS", "gRPC", "network security", "CDN"],
  "real-time processing": ["WebSockets", "Kafka Streams", "Flink", "Pub/Sub", "event-driven processing", "message brokers"],
  "serverless computing": ["AWS Lambda", "Google Cloud Functions", "Azure Functions", "FaaS", "event-driven execution"],
  "api security": ["API gateways", "rate limiting", "JWT", "OAuth", "CORS", "HMAC authentication"],
  "version control": ["Git", "GitHub", "GitLab", "Bitbucket", "trunk-based development", "branching strategies"],
  "software architecture": ["monolith", "microservices", "hexagonal architecture", "clean architecture", "event sourcing"],
  "performance optimization": ["caching", "CDN", "load testing", "profiling", "latency reduction"],
  "cloud cost optimization": ["FinOps", "spot instances", "auto-scaling", "reserved instances"],
  "aiops": ["incident response automation", "log analysis", "self-healing systems", "predictive maintenance"],
  "feature delivery": ["feature toggles", "canary releases", "A/B testing"],
  "platform engineering": ["developer experience", "internal developer platforms", "self-service infrastructure"],
  "edge computing": ["CDN", "5G computing", "IoT gateways", "serverless at the edge"],
  "web security": ["XSS", "CSRF", "SQL injection", "HSTS", "CSP", "secure headers"],
  "data privacy": ["GDPR", "CCPA", "data masking", "encryption at rest", "privacy by design"],
  "data engineering": ["ETL pipelines", "data lakes", "data warehouses", "data governance"],
  "mobile development": ["iOS", "Android", "Flutter", "React Native", "Swift", "Kotlin"],
  "progressive web apps": ["service workers", "offline-first", "PWA manifest"],
  "game development": ["Unity", "Unreal Engine", "WebGL", "game physics"],
  "quantum computing": ["Qiskit", "Microsoft Q#", "quantum circuits"],
  "embedded systems": ["C", "RTOS", "firmware development", "IoT"],
  "functional programming": ["Haskell", "Elixir", "Scala", "Clojure"],
  "enterprise software": ["SAP", "Oracle ERP", "Salesforce", "ServiceNow"],
  "low-code/no-code": ["Bubble", "OutSystems", "Mendix", "Zapier"],
  "blockchain": ["Ethereum", "Solidity", "Hyperledger", "smart contracts"],
  "5G technology": ["edge networks", "network slicing", "IoT connectivity"],
  "hardware acceleration": ["FPGA", "GPU computing", "CUDA", "TPUs"],
  "quantitative finance": ["quantitative modeling", "HFT", "risk analysis"],
};


// ✅ Ensure softSkills and industryTerms are defined
const softSkills: string[] = [
  "leadership", "teamwork", "collaboration", "problem-solving", "communication",
  "adaptability", "mentoring", "critical thinking", "initiative", "time management",
  "decision making", "attention to detail", "negotiation", "creativity",
  "empathy", "self-motivation", "flexibility", "resilience",
  "public speaking", "persuasion", "diplomacy", "coaching",
  "conflict resolution", "emotional intelligence", "active listening", "strategic thinking",
  "work ethic", "interpersonal skills", "patience", "innovation", "analytical thinking",
  "professionalism", "accountability", "multitasking", "goal setting", "self-discipline",
  "cultural awareness", "open-mindedness", "stress management", "organization",
  "presentation skills", "relationship building", "storytelling", "decision analysis",
  "logical reasoning", "resourcefulness", "networking", "persuasive writing",
  "process improvement", "customer focus", "stakeholder management", "growth mindset",
  "team empowerment", "constructive feedback", "cross-functional collaboration",
  "delegation", "influencing skills", "risk management", "self-awareness",
  "critical observation", "mindfulness", "change management", "service orientation",
  "situational awareness", "proactive mindset", "ethical judgment", "trustworthiness",
  "emotional resilience", "tactfulness", "continuous learning", "curiosity",
  "brainstorming", "conceptual thinking", "design thinking", "crisis management",
  "verbal communication", "nonverbal communication", "rapport building",
  "decision facilitation", "productivity", "self-reflection", "customer empathy",
  "cohesion building", "collaborative problem-solving"
];


const industryTerms: string[] = [
  // Core DevOps & Cloud Terms
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
  "platform engineering", "edge computing solutions", "SOC compliance",
  "virtualization", "hypervisor", "serverless architecture", "SaaS", "PaaS",
  "IaaS", "network security", "zero trust architecture", "federated learning",
  "OAuth", "RBAC", "data privacy", "blockchain", "smart contracts",
  "observability", "distributed tracing", "log aggregation", "fault tolerance",
  "high availability", "disaster recovery", "chaos engineering",
  "infrastructure automation", "immutable infrastructure", "blue-green deployment",
  "canary deployment", "rolling updates", "load balancing", "sticky sessions",
  "edge networking", "CDN", "web application firewall (WAF)", "rate limiting",
  "reverse proxy", "proxy caching", "DDoS mitigation", "service mesh",
  "API throttling", "multi-tenancy", "data sovereignty", "data governance",
  "schema migrations", "event-driven architecture", "CQRS", "domain-driven design",
  "actor model", "event sourcing", "stateful services", "stateless services",
  "message queues", "function-as-a-service (FaaS)", "cloud-native applications",
  "immutable deployments", "K8s operators", "bare-metal cloud",
  "security operations center (SOC)", "SIEM", "continuous compliance",
  "secrets management", "hashing algorithms", "encryption standards",
  "token-based authentication", "container security", "code linting",
  "static code analysis", "runtime security", "data lakes", "data pipelines",
  "ETL", "ELT", "graph databases", "sharding", "replication", "container registry",
  "Kubernetes namespaces", "policy as code", "progressive delivery",
  "shadow deployments", "traffic mirroring", "chaos testing", "observability pipeline",

  // 🚀 Principal Engineer Specific Additions (Enterprise-Level & Leadership)
  "Enterprise Architecture", "Scalability Planning", "Technical Debt Management",
  "IT Governance", "Enterprise Cloud Strategy", "Cost Optimization Strategies",
  "Software Engineering Best Practices", "Technical Roadmap Planning",
  "Cloud-Native Strategy", "Technology Risk Assessment", "High-Performance Computing",
  "Distributed Computing", "Data Mesh", "Parallel Processing",
  "Cloud-Native Governance", "Systems Thinking", "Hybrid Cloud Strategy",
  "Data Residency Compliance", "Federated Services Architecture",

  // 📊 Business & Strategic Thinking
  "Digital Transformation", "Business Continuity Planning",
  "IT Compliance & Regulations", "Vendor Management", "Technology Budgeting",
  "Cross-Team Collaboration", "Customer Experience Optimization",
  "Tech-Driven Business Growth", "Cloud Cost Management (FinOps)",

  // 🧠 AI, Emerging Technologies, and Automation
  "AI-Powered DevOps", "LLM (Large Language Models) Integration",
  "Self-Healing Infrastructure", "AI-Driven Security", "Autonomous Cloud Systems",
  "Generative AI in Software Engineering", "Edge AI & Distributed Machine Learning"
];




// ✅ Keyword Matching with Synonyms, Fuzzy & Partial Matching
// ✅ Matching Logic
function countMatches(resumeTokens: string[], jobKeywords: string[]): number {
  let matchCount = 0;

  for (const jobWord of jobKeywords) {
    const stemmedJobWord = stemmer.stem(jobWord);

    if (resumeTokens.includes(stemmedJobWord)) {
      matchCount += 1;
      continue;
    }

    for (const [key, synonymsList] of Object.entries(synonyms)) {
      if (synonymsList.includes(jobWord) || key === jobWord) {
        if (resumeTokens.includes(key) || resumeTokens.some(word => synonymsList.includes(word))) {
          matchCount += 0.85; // Higher weight for synonyms
          break;
        }
      }
    }

    if (resumeTokens.some(word => fuzzyMatch(word, stemmedJobWord))) {
      matchCount += 0.75;
    }
  }

  return matchCount;
}

// ✅ Main Matching Function
export function matchKeywords(resumeText: string, jobDescription: string): {
  keywordMatch: number;
  softSkillsMatch: number;
  industryTermsMatch: number;
} {
  const jobKeywords = tokenizeAndStem(jobDescription);
  const resumeTokens = tokenizeAndStem(resumeText);

  const keywordCount = countMatches(resumeTokens, jobKeywords);

  let softSkillsCount = softSkills.reduce((count, skill) => {
    if (resumeTokens.includes(stemmer.stem(skill.toLowerCase()))) return count + 4.0;
    if (resumeTokens.some(word => fuzzyMatch(word, skill))) return count + 3.5;
    return count;
  }, 0);

  let industryTermsCount = industryTerms.reduce((count, term) => {
    if (resumeTokens.includes(stemmer.stem(term.toLowerCase()))) return count + 4.0;
    if (resumeTokens.some(word => fuzzyMatch(word, term))) return count + 3.5;
    return count;
  }, 0);

  const keywordMatch = (keywordCount / jobKeywords.length) * 100;
  const softSkillsMatch = Math.min((softSkillsCount / softSkills.length) * 100, 20); // Cap at 25%
  const industryTermsMatch = Math.min((industryTermsCount / industryTerms.length) * 100, 25); // Cap at 25%

  return { keywordMatch, softSkillsMatch, industryTermsMatch };
}


// ✅ Optimized ATS Score Calculation
export function calculateATSScore(
  keywordMatch: number,
  formattingErrors: string[],
  softSkillsMatch: number,
  industryTermsMatch: number
): number {
  const majorErrors = formattingErrors.filter(err => err.includes("Missing name") || err.includes("Missing email"));
  const minorErrors = formattingErrors.filter(err => !majorErrors.includes(err));

  let keywordScore = keywordMatch * 0.35;  // 🔽 Lowered from 0.38
  let formattingPenalty = (majorErrors.length * 2.0) + (minorErrors.length * 0.6);
  let formattingScore = Math.max(0, 5 - formattingPenalty);  // 🔽 Reduced from 3.5
  let softSkillsScore = softSkillsMatch * 1.4;  // 🔼 Increased from 1.47
  let industryScore = industryTermsMatch * 1.7; // 🔼 Increased from 1.47

  let score = keywordScore + formattingScore + softSkillsScore + industryScore;
  return Math.max(0, Math.min(score, 80)); // 🔽 Capped at 80 max
}


