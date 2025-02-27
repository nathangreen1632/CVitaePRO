import * as cheerio from "cheerio";

export function parseResume(htmlResume: string) {
  const $ = cheerio.load(htmlResume);

  // Extract values and ensure empty strings become `null`
  const name = $("h1").text().trim() || null;
  const email = $('a[href^="mailto:"]').text().trim() || null;
  const phone = $('a[href^="tel:"]').text().trim() || null;
  const experience = $("section#experience").text().trim() || null;
  const education = $("section#education").text().trim() || null;
  const skills = $("section#skills").text().trim() || null;

  return { name, email, phone, experience, education, skills };
}

export function calculateATSScore(
  keywordMatch: number,
  formattingErrors: string[],
  softSkillsMatch: number,
  industryTermsMatch: number
): number {
  // 1️⃣ Keyword Matching: 70% Weight
  let keywordScore = keywordMatch * 0.7;

  // 2️⃣ Formatting & Readability: 15% Weight
  let formattingPenalty = formattingErrors.length * 3; // Lower penalty per issue (-3 instead of -5)
  let formattingScore = Math.max(0, 15 - formattingPenalty); // Ensure formatting doesn't over-penalize

  // 3️⃣ Soft Skills & Action Verbs: 10% Weight
  let softSkillsScore = softSkillsMatch * 0.1;

  // 4️⃣ Industry-Specific Terms: 5% Weight
  let industryScore = industryTermsMatch * 0.05;

  // Final ATS Score Calculation
  let score = keywordScore + formattingScore + softSkillsScore + industryScore;
  return Math.max(0, Math.min(score, 100)); // Ensure the score remains within 0-100%
}


export function matchKeywords(resumeText: string, jobDescription: string): {
  keywordMatch: number;
  softSkillsMatch: number;
  industryTermsMatch: number;
} {
  // Ensure match() always returns an array (empty array if null)
  const jobKeywords: string[] = jobDescription.toLowerCase().match(/\b\w+\b/g) || [];
  const resumeWords: string[] = resumeText.toLowerCase().match(/\b\w+\b/g) || [];

  let keywordCount = 0;
  let softSkillsCount = 0;
  let industryTermsCount = 0;

  // Define lists of soft skills and industry-specific terms
  const softSkills = ["leadership", "teamwork", "collaboration", "problem-solving", "communication", "adaptability", "mentoring", "critical thinking", "initiative"];
  const industryTerms = ["CI/CD", "microservices", "Kubernetes", "AWS", "GCP", "cloud computing", "DevOps", "agile development", "serverless", "containerization", "orchestration"];

  for (const word of resumeWords) {
    if (jobKeywords.includes(word)) keywordCount++;
    if (softSkills.includes(word)) softSkillsCount++;
    if (industryTerms.includes(word)) industryTermsCount++;
  }

  return {
    keywordMatch: (keywordCount / jobKeywords.length) * 100,
    softSkillsMatch: (softSkillsCount / softSkills.length) * 100,
    industryTermsMatch: (industryTermsCount / industryTerms.length) * 100,
  };
}

