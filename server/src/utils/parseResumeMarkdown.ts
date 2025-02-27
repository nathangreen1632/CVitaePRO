export const parseResumeMarkdown = (markdown: string, inputData: any): Record<string, any> => {
  // ✅ Remove leading/trailing backticks (if OpenAI wraps in ```markdown ... ```)
  markdown = markdown.replace(/^```[a-zA-Z]*\n/, "").replace(/\n```$/, "").trim();

  // ✅ Extract contact details directly from input data (ensures no missing values)
  const resume: Record<string, any> = {
    name: inputData.name || "",
    email: inputData.email || "",
    phone: inputData.phone || "",
    summary: "",
    experience: [],
    education: inputData.education || [],
    skills: [],
    certifications: []
  };

  const sections = markdown.split(/\n(?=## )/); // ✅ Splits sections at markdown headers (## Section)

  for (const section of sections) {
    const lines = section.trim().split("\n");
    if (lines.length === 0) continue;

    let title = lines[0].replace(/[*#]/g, "").trim(); // ✅ Remove Markdown symbols
    let content = lines.slice(1).map(line => line.replace(/[*-]/g, "").trim()).filter(line => line.length > 0); // ✅ Clean content

    if (title.toLowerCase().includes("summary")) {
      resume["summary"] = content.join(" ");
    }
    else if (title.toLowerCase().includes("experience")) {
      resume["experience"] = parseExperienceSection(content, inputData.experience);
    }
    else if (title.toLowerCase().includes("education")) {
      resume["education"] = parseEducationSection(content, inputData.education);
    }
    else if (title.toLowerCase().includes("skills")) {
      resume["skills"] = parseSkillsSection(content);
    }
    else if (title.toLowerCase().includes("certifications")) {
      resume["certifications"] = parseCertificationsSection(content, inputData.certifications);
    }
  }

  return resume;
};

// ✅ Function to Parse Experience Section (Fixes Dates)
const parseExperienceSection = (content: string[], inputExperience: any[]): any[] => {
  const experiences: any[] = [];
  let currentJob: any = null;

  content.forEach((line) => {
    if (line.startsWith("### ")) {
      if (currentJob) experiences.push(currentJob);
      currentJob = { company: "", role: "", dates: "", responsibilities: [] };
      currentJob.company = line.replace("### ", "").trim();
    }
    else if (currentJob && !currentJob.role) {
      currentJob.role = line.trim();
    }
    else if (currentJob && !currentJob.dates) {
      const dates = line.split(" - ").map(d => d.trim());
      const startDate = formatDate(dates[0]);

      let endDate = dates.length > 1 ? dates[1] : "";

      // ✅ Only add "Present" if there's NO end date
      if (!endDate || endDate.toLowerCase() === "present") {
        currentJob.dates = `${startDate} – Present`;
      } else {
        currentJob.dates = `${startDate} – ${formatDate(endDate)}`;
      }

      // ✅ Ensure "Present" isn't mistakenly appended when an end date exists
      if (!endDate.toLowerCase().includes("present") && currentJob.dates.includes("– Present")) {
        currentJob.dates = currentJob.dates.replace("– Present", "");
      }

      // ✅ Remove duplicate "Present"
      currentJob.dates = currentJob.dates.replace(/– Present\s*–\s*Present$/, "– Present");

      // ✅ Fix missing separator issue (e.g., "June 2019 Present – Present")
      currentJob.dates = currentJob.dates.replace(/(\d{4}) Present/, "$1 – Present");

      // ✅ Remove extra spaces
      currentJob.dates = currentJob.dates.replace(/\s{2,}/g, " ").trim();
    }
    else if (currentJob) {
      currentJob.responsibilities.push(fixHyphenSpacing(line.trim()));
    }
  });

  if (currentJob) experiences.push(currentJob);

  return experiences.length > 0 ? experiences : inputExperience;
};

// ✅ Function to Reformat Dates to YYYY-MM-DD & Remove `_`
const formatDate = (dateStr: string): string => {
  dateStr = dateStr.replace(/_/g, "").trim(); // ✅ Remove `_` from date
  const months: Record<string, string> = {
    "January": "01", "February": "02", "March": "03", "April": "04",
    "May": "05", "June": "06", "July": "07", "August": "08",
    "September": "09", "October": "10", "November": "11", "December": "12"
  };

  const parts = dateStr.split(" ");
  if (parts.length === 2) {
    const month = months[parts[0]] || "01"; // Default to January if unknown
    return `${parts[1]}-${month}-01`;
  }
  return dateStr;
};

// ✅ Function to Fix Hyphenated Word Spacing (e.g., "ProblemSolving" → "Problem-Solving")
const fixHyphenSpacing = (text: string): string => {
  return text
    .replace(/customerfacing/g, "customer-facing")
    .replace(/thirdparty/g, "third-party")
    .replace(/ProblemSolving/g, "Problem-Solving");
};

// ✅ Function to Parse Education Section (Ensures Proper Formatting)
const parseEducationSection = (content: string[], inputEducation: any[]): any[] => {
  const education: any[] = [];
  let currentEducation: any = {};

  content.forEach((line) => {
    if (line.includes("Graduation Year")) {
      currentEducation.graduation_year = line.replace("Graduation Year:", "").trim();
      education.push(currentEducation);
      currentEducation = {};
    }
    else if (!currentEducation?.degree) {
      currentEducation.degree = line.trim();
    }
    else if (!currentEducation?.institution) {
      currentEducation.institution = line.trim();
    }
  });

  return education.length > 0 ? education : inputEducation; // ✅ Uses inputEducation if empty
};

// ✅ Function to Parse Skills Section (Ensures No Certifications)
const parseSkillsSection = (content: string[]): string[] => {
  let skills: string[] = [];

  content.forEach(skill => {
    if (skill.includes(":")) {
      skills = skills.concat(skill.split(":")[1].split(",").map(s => s.trim()));
    } else {
      skills.push(skill.trim());
    }
  });

  return skills
    .filter(skill => !skill.toLowerCase().includes("certified") && !skill.toLowerCase().includes("certification"))
    .map(skill => fixHyphenSpacing(skill)); // ✅ Fix hyphen spacing issues
};

// ✅ Function to Parse Certifications (Filter Out Junk)
const parseCertificationsSection = (content: string[], inputCertifications: any[]): any[] => {
  const certifications = content
    .map(cert => {
      const parts = cert.split(",");
      return { name: parts[0].trim(), year: parts[1]?.trim() || "" };
    })
    .filter(cert =>
      cert.name && cert.name.length > 3 &&
      !cert.name.includes("By structuring") &&
      !cert.name.includes("resume format") &&
      !cert.name.includes("ensures clarity and compatibility")
    ); // ✅ Filter out junk GPT responses

  return certifications.length > 0 ? certifications : inputCertifications;
};
