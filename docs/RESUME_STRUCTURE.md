# RESUME STRUCTURE

## Overview

CVitaePRO uses a normalized JSON structure to store, enhance, and render resumes. This format ensures compatibility with OpenAI, accurate ATS scoring, and consistency across resume generation, editing, and downloading processes.

This document outlines the expected structure for all resume objects passed through the frontend, backend, OpenAI API, and document renderers.

---

## Resume Object Schema

Each resume follows this structure:

```ts
{
  name: string;
  email: string;
  phone: string;
  linkedin: string;
  portfolio: string;
  summary: string;
  experience: ExperienceEntry[];
  education: EducationEntry[];
  skills: string[];
  certifications: string[];
}
```

---

## ExperienceEntry[]

```ts
{
  id: string; // unique identifier (UUID or timestamp)
  company: string;
  role: string;
  startDate: string; // ISO or Month/Year
  endDate: string;   // or "Present"
  responsibilities: string[]; // bullet point style
}
```

- Each experience entry represents one position.
- Multiple entries can be listed under the same or different companies.
- Dates should follow a consistent readable format.
- `responsibilities[]` should use concise, measurable bullet points.

---

## EducationEntry[]

```ts
{
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  honors?: string;
  location?: string;
}
```

- Optional fields like GPA and honors are used if provided.
- Location is optional but improves context for international resumes.

---

## Skills

```ts
[
  "JavaScript",
  "Project Management",
  "UX Writing",
  "Agile",
  "SQL"
]
```

- Skills should be listed as keywords/phrases.
- Avoid sentence-style input.
- This list is used directly in ATS scoring.

---

## Certifications

```ts
[
  "Google Data Analytics Certificate",
  "AWS Certified Solutions Architect",
  "Scrum Master (PSM I)"
]
```

- Certification strings should be full titles.
- Avoid abbreviations unless industry-standard.

---

## Notes

- Every resume is converted to and from Markdown for OpenAI enhancements.
- The structure is maintained during parsing, enhancement, and export.
- Client-side form sections (React Hook Form) map directly to these fields.
- `resumeId` is stored separately in the database and not required in this object.

---

## Integration Points

- Used in `/api/resume/generate`
- Parsed from OpenAI markdown via `parseResumeMarkdown.ts`
- Scored via `/api/ats/score-resume`
- Downloaded as PDF/DOCX via `/api/resume/download/:id`

