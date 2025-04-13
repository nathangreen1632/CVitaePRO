interface ResumeInput {
  name: string;
  email: string;
  phone: string;
  linkedin?: string;
  portfolio?: string;
  summary: string;
  experience: {
    company: string;
    role: string;
    start_date: string;
    end_date: string;
    responsibilities: string[];
  }[];
  education: {
    institution: string;
    degree: string;
    graduation_year: string;
  }[];
  skills: string[];
  certifications: {
    name: string;
    year: string;
  }[];
}

export function buildOpenAIPayload(resume: ResumeInput): string {
  return `
    - Applicant Name: ${resume.name}
    - Contact Info: Email - ${resume.email}, Phone - ${resume.phone}, LinkedIn - ${resume.linkedin ?? "N/A"}, Portfolio - ${resume.portfolio ?? "N/A"}

    - Resume Summary: ${resume.summary}
    - Experience: ${JSON.stringify(resume.experience, null, 2)}
    - Education: ${JSON.stringify(resume.education, null, 2)}
    - Skills: ${resume.skills.join(", ")}
    - Certifications: ${JSON.stringify(resume.certifications, null, 2)}
  `.trim();
}
