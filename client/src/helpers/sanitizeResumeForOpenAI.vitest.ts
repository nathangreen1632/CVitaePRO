import { describe, it, expect } from "vitest";
import { sanitizeResumeForOpenAI, ResumeData } from "./sanitizeResumeForOpenAI";

describe("sanitizeResumeForOpenAI", () => {
  const baseResume: ResumeData = {
    name: "John Doe",
    email: "john@example.com",
    phone: "123-456-7890",
    linkedin: "linkedin.com/in/johndoe",
    portfolio: "johndoe.dev",
    summary: "Experienced full-stack engineer",
    experience: [
      {
        company: "Company A",
        role: "Developer",
        start_date: "2020-01-01",
        end_date: "2022-01-01",
        responsibilities: ["Built web apps", "Maintained APIs"]
      }
    ]
  };

  it("preserves valid education, certifications, and skills", () => {
    const input: ResumeData = {
      ...baseResume,
      education: [
        { institution: "MIT", degree: "CS", graduation_year: "2020" }
      ],
      certifications: [{ name: "AWS Certified", year: "2021" }],
      skills: ["TypeScript", "React"]
    };

    const result = sanitizeResumeForOpenAI(input);
    expect(result.education).toBeDefined();
    expect(result.certifications).toBeDefined();
    expect(result.skills).toBeDefined();
  });

  it("removes education if fields are blank", () => {
    const input: ResumeData = {
      ...baseResume,
      education: [
        { institution: "", degree: "  ", graduation_year: "" }
      ]
    };

    const result = sanitizeResumeForOpenAI(input);
    expect(result.education).toBeUndefined();
  });

  it("removes certifications if all are invalid", () => {
    const input: ResumeData = {
      ...baseResume,
      certifications: [
        { name: "", year: "" },
        { name: " ", year: " " }
      ]
    };

    const result = sanitizeResumeForOpenAI(input);
    expect(result.certifications).toBeUndefined();
  });

  it("removes skills if list is empty", () => {
    const input: ResumeData = {
      ...baseResume,
      skills: []
    };

    const result = sanitizeResumeForOpenAI(input);
    expect(result.skills).toBeUndefined();
  });

  it("removes skills if they all contain 'Placeholder'", () => {
    const input: ResumeData = {
      ...baseResume,
      skills: ["Placeholder Skill", "Placeholder"]
    };

    const result = sanitizeResumeForOpenAI(input);
    expect(result.skills).toBeUndefined();
  });

  it("keeps resume untouched if all fields are valid", () => {
    const input: ResumeData = {
      ...baseResume,
      education: [
        { institution: "Harvard", degree: "BA", graduation_year: "2019" }
      ],
      certifications: [{ name: "Cert A", year: "2020" }],
      skills: ["JS", "HTML", "CSS"]
    };

    const result = sanitizeResumeForOpenAI(input);
    expect(result).toEqual(input);
  });
});
