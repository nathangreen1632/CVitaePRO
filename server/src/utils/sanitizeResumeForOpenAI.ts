export interface Experience {
  company: string;
  role: string;
  start_date: string;
  end_date: string;
  responsibilities: string[];
}

export interface Education {
  institution: string;
  degree: string;
  graduation_year: string;
}

export interface Certification {
  name: string;
  year: string;
}

export interface ResumeData {
  name: string;
  email: string;
  phone: string;
  linkedin: string;
  portfolio: string;
  summary: string;
  experience?: Experience[];
  education?: Education[];
  skills?: string[];
  certifications?: Certification[];
}

export function sanitizeResumeForOpenAI(resumeData: ResumeData): ResumeData {
  const sanitized = { ...resumeData };

  if (
    !Array.isArray(sanitized.education) ||
    sanitized.education.length === 0 ||
    sanitized.education.every(
      (edu) =>
        !edu.degree?.trim() ||
        !edu.institution?.trim() ||
        !edu.graduation_year?.trim()
    )
  ) {
    delete sanitized.education;
  }

  if (
    !Array.isArray(sanitized.certifications) ||
    sanitized.certifications.length === 0 ||
    sanitized.certifications.every(
      (cert) => !cert.name?.trim() || !cert.year?.trim()
    )
  ) {
    delete sanitized.certifications;
  }

  if (
    !Array.isArray(sanitized.skills) ||
    sanitized.skills.length === 0 ||
    sanitized.skills.every((skill) =>
      !skill?.trim() || skill.includes("Placeholder")
    )
  ) {
    delete sanitized.skills;
  }

  return sanitized;
}
