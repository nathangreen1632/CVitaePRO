import { describe, it, expect } from "vitest";
import { buildOpenAIPayload } from "./buildOpenAIPayload";

describe("buildOpenAIPayload", () => {
  const resume = {
    name: "John Doe",
    email: "john@example.com",
    phone: "123-456-7890",
    linkedin: "linkedin.com/in/johndoe",
    portfolio: "johndoe.dev",
    summary: "Experienced full-stack developer with a passion for clean code.",
    experience: [
      {
        company: "Company A",
        role: "Software Engineer",
        start_date: "2020-01-01",
        end_date: "2022-01-01",
        responsibilities: ["Developed APIs", "Led a frontend team"]
      }
    ],
    education: [
      {
        institution: "University X",
        degree: "B.S. Computer Science",
        graduation_year: "2019"
      }
    ],
    skills: ["TypeScript", "React", "Node.js"],
    certifications: [{ name: "AWS Certified Developer", year: "2021" }]
  };

  it("builds a well-formatted OpenAI payload", () => {
    const payload = buildOpenAIPayload(resume);

    expect(payload).toContain("- Applicant Name: John Doe");
    expect(payload).toContain("Email - john@example.com");
    expect(payload).toContain("Phone - 123-456-7890");
    expect(payload).toContain("LinkedIn - linkedin.com/in/johndoe");
    expect(payload).toContain("Portfolio - johndoe.dev");
    expect(payload).toContain("- Resume Summary: Experienced full-stack developer");

    expect(payload).toContain('"company": "Company A"');
    expect(payload).toContain('"degree": "B.S. Computer Science"');
    expect(payload).toContain("TypeScript, React, Node.js");
    expect(payload).toContain('"name": "AWS Certified Developer"');
  });

  it("handles missing optional fields like LinkedIn and Portfolio", () => {
    const resumeWithoutLinks = {
      ...resume,
      linkedin: undefined,
      portfolio: undefined
    };

    const payload = buildOpenAIPayload(resumeWithoutLinks);

    expect(payload).toContain("LinkedIn - N/A");
    expect(payload).toContain("Portfolio - N/A");
  });
});
