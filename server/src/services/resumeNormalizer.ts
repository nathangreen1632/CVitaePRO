import { ResumeData } from "../types/resumeTypes";

/**
 * Normalizes resume data to a structured format.
 * @param {string} rawText - Raw text extracted from a resume.
 * @returns {ResumeData} - Structured resume object.
 */
export function normalizeResume(rawText: string): ResumeData {
  const lines = rawText.split("\n").map(line => line.trim()).filter(Boolean);

  const resume: ResumeData = {
    name: "",
    contact: "",
    skills: [],
    experience: [],
    education: [],
  };

  let currentSection = "";

  lines.forEach(line => {
    if (line.toLowerCase().includes("experience")) {
      currentSection = "experience";
    } else if (line.toLowerCase().includes("education")) {
      currentSection = "education";
    } else if (line.toLowerCase().includes("skills")) {
      currentSection = "skills";
    } else if (currentSection === "experience") {
      resume.experience.push(line);
    } else if (currentSection === "education") {
      resume.education.push(line);
    } else if (currentSection === "skills") {
      resume.skills.push(line);
    } else if (!resume.name) {
      resume.name = line;
    } else if (!resume.contact) {
      resume.contact = line;
    }
  });

  return resume;
}
