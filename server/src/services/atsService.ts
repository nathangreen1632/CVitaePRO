import * as cheerio from "cheerio";


export function parseResume(htmlResume: string) {
  const $ = cheerio.load(htmlResume);
  return {
    name: $("h1").text(),
    email: $('a[href^="mailto:"]').text(),
    phone: $('a[href^="tel:"]').text(),
    experience: $("section#experience").text(),
    education: $("section#education").text(),
    skills: $("section#skills").text(),
  };
}

export function matchKeywords(resumeText: string, jobDescription: string): number {
  const jobKeywords: string[] = jobDescription.toLowerCase().match(/\b\w+\b/g) || [];
  const resumeWords: string[] = resumeText.toLowerCase().match(/\b\w+\b/g) || [];

  const matches = jobKeywords.filter((word) => resumeWords.includes(word)).length;
  return (matches / jobKeywords.length) * 100; // Return match percentage
}

export function calculateATSScore(keywordMatch: number, formattingErrors: string[]): number {
  let score = keywordMatch * 0.9; // 90% based on keyword matching
  score -= formattingErrors.length * 5; // Deduct for formatting issues
  return Math.max(0, Math.min(score, 100)); // Ensure score is between 0 and 100
}
