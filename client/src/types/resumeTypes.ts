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

export interface ResumeCardProps {
  id: string;
  name: string;
  resumeSnippet: string;
  summary: string;
  email: string;
  phone: string;
  linkedin: string;
  portfolio: string;
  experience?: Experience[];
  education?: Education[];
  skills?: string[];
  certifications?: Certification[];
  refreshResumes: () => void;
}
