// buildMarkdownFromResume.ts

import removeMarkdown from "remove-markdown"; // Ensure this is installed: npm i remove-markdown

// 🔧 Enhanced stripper to catch markdown that `remove-markdown` misses
const stripMarkdown = (markdown: string): string => {
  return markdown
    .replace(/^```[a-zA-Z]*\n/, "")       // Remove code block start
    .replace(/\n```$/, "")                // Remove code block end
    .replace(/^#+\s*/gm, "")              // Remove markdown headers
    .replace(/\*\*(.*?)\*\*/g, "$1")      // Convert bold to plain text
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")   // Convert links to text
    .replace(/[-*]\s+/g, "")              // Remove bullets
    .replace(/\\n/g, " ")                 // Remove escaped line breaks
    .replace(/\n+/g, " ")                 // Collapse multiple newlines
    .trim();
};

// ✅ Combined cleaner: first remove markdown, then deeper strip
const clean = (text: string): string => stripMarkdown(removeMarkdown(text || "").trim());

interface ExperienceEntry {
  company: string;
  role: string;
  start_date: string;
  end_date: string;
  responsibilities: string[];
}

interface EducationEntry {
  degree: string;
  institution: string;
  graduation_year: string;
}

interface CertificationEntry {
  name: string;
  year: string;
}

interface ResumeData {
  name: string;
  email: string;
  phone: string;
  linkedin: string;
  portfolio: string;
  summary: string;
  experience: ExperienceEntry[];
  education: EducationEntry[];
  skills: string[];
  certifications: CertificationEntry[];
}

export const buildMarkdownFromResume = (resume: ResumeData): string => {
  const name = clean(resume.name);
  const email = clean(resume.email);
  const phone = clean(resume.phone);
  const linkedin = clean(resume.linkedin);
  const portfolio = clean(resume.portfolio);
  const summary = clean(resume.summary);

  let markdown = `# ${name}\n\n`;

  markdown += `## Contact Information\n`;
  markdown += `- **Name:** ${name}\n`;
  markdown += `- **Email:** ${email}\n`;
  markdown += `- **Phone:** ${phone}\n`;
  markdown += `- **LinkedIn:** ${linkedin}\n`;
  markdown += `- **Portfolio:** ${portfolio}\n\n`;

  markdown += `## Summary\n${summary}\n\n`;

  markdown += `## Experience\n`;
  for (const exp of resume.experience) {
    markdown += `### ${clean(exp.company)}\n`;
    markdown += `**${clean(exp.role)}**  \n`;
    markdown += `*${clean(exp.start_date)} - ${clean(exp.end_date)}*\n\n`;
    for (const responsibility of exp.responsibilities) {
      markdown += `- ${clean(responsibility)}\n`;
    }
    markdown += `\n`;
  }

  markdown += `## Education\n`;
  for (const edu of resume.education) {
    markdown += `- **${clean(edu.degree)}**  \n  ${clean(edu.institution)}, ${clean(edu.graduation_year)}\n\n`;
  }

  markdown += `## Skills\n`;
  for (const skill of resume.skills) {
    markdown += `- ${clean(skill)}\n`;
  }

  markdown += `\n## Certifications\n`;
  for (const cert of resume.certifications) {
    markdown += `- **${clean(cert.name)}**, ${clean(cert.year)}\n`;
  }

  return markdown.trim();
};
