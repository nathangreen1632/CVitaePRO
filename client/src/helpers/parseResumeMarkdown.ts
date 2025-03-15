export interface ParsedResume {
  name?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  portfolio?: string;
  summary?: string;
  experience?: {
    role?: string;
    company?: string;
    start_date?: string;
    end_date?: string;
    responsibilities?: string[];
  }[];
  education?: {
    degree?: string;
    institution?: string;
    graduation_year?: string;
  }[];
  skills?: string[];
  certifications?: {
    name?: string;
    year?: string;
  }[];
}

export const parseResumeMarkdown = (
  markdown: string,
  inputData: Partial<ParsedResume> = {}
): ParsedResume => {
  markdown = markdown.replace(/^```[a-zA-Z]*\n/, "").replace(/\n```$/, "").trim();

  const jsonMatch = RegExp(/```json\n([\s\S]*?)\n```/).exec(markdown);
  if (jsonMatch) {
    try {
      const parsedJson = JSON.parse(jsonMatch[1]);

      let summary = "No summary provided.";
      if (typeof parsedJson.summary === "string") {
        summary = parsedJson.summary;
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
    }
  }

  console.warn("⚠️ No JSON block found in markdown. Falling back to section-based parsing.");

  const contactInfoRegex = {
    name: /#\s+([A-Z][a-z]+\s[A-Z][a-z]+)/,
    email: /[*_-]*Email[:：]*[*_-]*\s*([\w.-]+@[\w.-]+\.\w+)/i,
    phone: /[*_-]*Phone[:：]*[*_-]*\s*([\d\-().\s]{10,})/i,
    linkedin: /linkedin\.com\/in\/[^\s)]+/i,
    portfolio: /https?:\/\/[^\s)]+/i,
  };

  const fallbackFields: Partial<ParsedResume> = {};

  const nameMatch = RegExp(contactInfoRegex.name).exec(markdown);
  const emailMatch = RegExp(contactInfoRegex.email).exec(markdown);
  const phoneMatch = RegExp(contactInfoRegex.phone).exec(markdown);
  const linkedinMatch = RegExp(contactInfoRegex.linkedin).exec(markdown);
  const portfolioMatch = RegExp(contactInfoRegex.portfolio).exec(markdown);

  if (nameMatch) fallbackFields.name = nameMatch[1];
  if (emailMatch) fallbackFields.email = emailMatch[1];
  if (phoneMatch) fallbackFields.phone = phoneMatch[1];
  if (linkedinMatch) fallbackFields.linkedin = linkedinMatch[0];
  if (portfolioMatch) fallbackFields.portfolio = portfolioMatch[0];

  const resume: ParsedResume = {
    name: fallbackFields.name || inputData.name || "",
    email: fallbackFields.email || inputData.email || "",
    phone: fallbackFields.phone || inputData.phone || "",
    linkedin: fallbackFields.linkedin || inputData.linkedin || "",
    portfolio: fallbackFields.portfolio || inputData.portfolio || "",
    summary: inputData.summary || "No summary provided.",
    experience: inputData.experience || [],
    education: inputData.education || [],
    skills: inputData.skills || ["No skills listed."],
    certifications: inputData.certifications || [{ name: "No certifications listed." }],
  };

  const sections = markdown.split(/\n(?=## )/);

  for (const section of sections) {
    const lines = section.trim().split("\n");
    if (lines.length === 0) continue;

    let title = lines[0].replace(/[*#]/g, "").trim();
    let content = lines.slice(1).map(line => line.replace(/[*-]/g, "").trim()).filter(line => line.length > 0);

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
        resume.certifications = parseCertificationsSection(content, inputData.certifications || []) || [{ name: "No certifications listed." }];
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
