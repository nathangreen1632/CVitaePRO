import { buildFallbackResume } from "./buildFallbackResume.ts";

export const parseResumeMarkdown = (markdown: string, inputData: any): Record<string, any> => {
  if (!markdown) return buildFallbackResume(inputData);

  try {
    markdown = markdown.replace(/^```[a-zA-Z]*\n/, "").replace(/\n```$/, "").trim();

    const jsonMatch = /```json\n([\s\S]*?)\n```/.exec(markdown);
    if (jsonMatch?.[1]) {
      const parsed = tryParseJsonMarkdown(jsonMatch[1], inputData);
      if (parsed) return parsed;
    }

    return parseStructuredMarkdown(markdown, inputData);
  } catch (err) {
    return buildFallbackResume(inputData);
  }
};

const tryParseJsonMarkdown = (jsonBlock: string, inputData: any): Record<string, any> | null => {
  try {
    const parsedJson = JSON.parse(jsonBlock);

    let summary = "No summary provided.";
    if (typeof parsedJson.summary === "string") {
      const summarySection = parsedJson.summary
        .split(/\n(?=## )/)
        .find((s: string) => s.toLowerCase().startsWith("## summary"));

      summary = summarySection
        ? summarySection.replace(/## summary/i, "").replace(/[*_~`>#-]/g, "").trim()
        : parsedJson.summary;
    } else if (typeof inputData.summary === "string") {
      summary = inputData.summary;
    }

    let certifications: any[] = [];
    if (Array.isArray(parsedJson.certifications)) {
      certifications = parsedJson.certifications;
    } else if (Array.isArray(inputData.certifications)) {
      certifications = inputData.certifications;
    }

    return {
      name: parsedJson.name || inputData.name,
      email: parsedJson.email || inputData.email,
      phone: parsedJson.phone || inputData.phone,
      linkedin: parsedJson.linkedin || inputData.linkedin,
      portfolio: parsedJson.portfolio || inputData.portfolio,
      summary,
      experience: parsedJson.experience || inputData.experience || [],
      education: parsedJson.education || inputData.education || [],
      skills: parsedJson.skills || inputData.skills || ["No skills listed."],
      certifications,
    };
  } catch (error) {
    console.error("❌ Failed to parse JSON from markdown:", error);
    return null;
  }
};

const parseStructuredMarkdown = (markdown: string, inputData: any): Record<string, any> => {
  const resume: Record<string, any> = {
    name: inputData.name || "",
    email: inputData.email || "",
    phone: inputData.phone || "",
    linkedin: inputData.linkedin || "",
    portfolio: inputData.portfolio || "",
    summary: inputData.summary || "No summary provided.",
    experience: inputData.experience || [],
    education: inputData.education || [],
    skills: inputData.skills || ["No skills listed."],
    certifications: inputData.certifications || ["No certifications listed."]
  };

  const sections = markdown.split(/\n(?=## )/);

  for (const section of sections) {
    const lines = section.trim().split("\n");
    if (lines.length === 0) continue;

    const title = lines[0].replace(/[*#]/g, "").trim();
    const content = lines.slice(1).map(line => line.replace(/[*-]/g, "").trim()).filter(line => line.length > 0);

    switch (title.toLowerCase()) {
      case "contact information":
        content.forEach((line) => {
          if (line.toLowerCase().includes("email:")) {
            resume.email = line.split(":")[1]?.trim() || inputData.email || "";
          } else if (line.toLowerCase().includes("phone:")) {
            resume.phone = line.split(":")[1]?.trim() || inputData.phone || "";
          }
        });
        break;
      case "summary":
        resume.summary = content.join(" ") || inputData.summary || "No summary provided.";
        break;
      case "experience":
        resume.experience = parseExperienceSection(content, inputData.experience || []);
        break;
      case "education":
        resume.education = parseEducationSection(content, inputData.education || []);
        break;
      case "skills":
        resume.skills = parseSkillsSection(content, inputData.skills || []) || ["No skills listed."];
        break;
      case "certifications":
        resume.certifications = parseCertificationsSection(content, inputData.certifications || []) || ["No certifications listed."];
        break;
      default:
        break;
    }
  }

  return resume;
};

const parseExperienceSection = (content: string[], inputExperience: any[]): any[] => {
  const experiences: any[] = [];
  let currentJob: any = null;

  content.forEach((line) => {
    if (line.startsWith("### ")) {
      if (currentJob) experiences.push(currentJob);
      currentJob = { company: "", role: "", start_date: "", end_date: "", responsibilities: [] };
      currentJob.company = line.replace("### ", "").trim();
    } else if (currentJob && !currentJob.role) {
      currentJob.role = line.trim();
    } else if (currentJob && !currentJob.start_date) {
      const dates = line.split(" - ").map(d => d.trim());
      const startDate = formatDate(dates[0]);
      let endDate = dates.length > 1 ? dates[1] : "";
      currentJob.start_date = startDate;
      currentJob.end_date = endDate.toLowerCase() === "present" ? "Present" : formatDate(endDate);
    } else if (currentJob) {
      currentJob.responsibilities.push(line.trim());
    }
  });

  if (currentJob) experiences.push(currentJob);
  return experiences.length > 0 ? experiences : inputExperience;
};

const parseSkillsSection = (content: string[], inputSkills: string[]): string[] => {
  let skills: string[] = content.map(skill => skill.trim()).filter(skill => skill.length > 0);
  return skills.length > 0 ? skills : inputSkills;
};

const parseCertificationsSection = (content: string[], inputCertifications: any[]): any[] => {
  const certifications = content.map(cert => {
    const parts = cert.split(",");
    return { name: parts[0].trim(), year: parts[1]?.trim() || "" };
  }).filter(cert => cert.name.length > 3);

  return certifications.length > 0 ? certifications : inputCertifications;
};

const parseEducationSection = (content: string[], inputEducation: any[]): any[] => {
  const education: any[] = [];
  let currentEducation: any = {};

  content.forEach((line) => {
    if (line.includes("Graduation Year")) {
      currentEducation.graduation_year = line.replace("Graduation Year:", "").trim();
      education.push(currentEducation);
      currentEducation = {};
    } else if (!currentEducation?.degree) {
      currentEducation.degree = line.trim();
    } else if (!currentEducation?.institution) {
      currentEducation.institution = line.trim();
    }
  });

  return education.length > 0 ? education : inputEducation;
};

const formatDate = (dateStr: string): string => {
  dateStr = dateStr.trim();
  const months: Record<string, string> = {
    "January": "01", "February": "02", "March": "03", "April": "04",
    "May": "05", "June": "06", "July": "07", "August": "08",
    "September": "09", "October": "10", "November": "11", "December": "12"
  };
  const parts = dateStr.split(" ");
  if (parts.length === 2) {
    const month = months[parts[0]] || "01";
    return `${parts[1]}-${month}-01`;
  }
  return dateStr;
};
