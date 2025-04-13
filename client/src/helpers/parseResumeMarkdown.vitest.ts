import { describe, it, expect, vi } from "vitest";
import { parseResumeMarkdown } from "./parseResumeMarkdown";

// Mock buildFallbackResume
vi.mock("./buildFallbackResume.js", () => ({
  buildFallbackResume: vi.fn((input) => ({
    ...input,
    summary: "No summary provided.",
    skills: input.skills ?? ["No skills listed."],
  })),
}));

describe("parseResumeMarkdown", () => {
  const inputData = {
    name: "Jane Doe",
    email: "jane@example.com",
    phone: "123-456-7890",
    summary: "Existing summary",
    skills: ["TypeScript", "React"],
    certifications: [{ name: "Cert A", year: "2022" }],
    experience: [],
    education: []
  };

  it("returns fallback resume when markdown is empty", () => {
    const result = parseResumeMarkdown("", inputData);
    expect(result.name).toBe("Jane Doe");
    expect(result.summary).toBe("No summary provided.");
  });

  it("parses resume from valid JSON markdown", () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});

    const json = {
      name: "John Doe",
      email: "john@example.com",
      summary: "## Summary\nExperienced dev",
      skills: ["JS", "HTML"],
      certifications: [{ name: "Cert B", year: "2021" }]
    };

    const markdown = JSON.stringify(json, null, 2); // ← raw JSON only

    const result = parseResumeMarkdown(markdown, inputData);
    expect(result.name).toBe("John Doe");
    expect(result.email).toBe("john@example.com");
    expect(result.summary).toContain("Experienced dev");
    expect(result.skills).toContain("JS");
    expect(result.certifications[0].name).toBe("Cert B");
  });



  it("falls back when JSON block is malformed", () => {
    const malformed = "```json\n{ name: 'Bad JSON' \n```";
    const result = parseResumeMarkdown(malformed, inputData);
    expect(result.name).toBe("Jane Doe");
  });

  it("parses structured markdown fallback correctly", () => {
    const structured = `
## Contact Information
Email: test@example.com
Phone: 999-999-9999

## Summary
Full stack developer with 5+ years experience.

## Skills
JavaScript
React
Node.js

## Certifications
AWS Certified Developer, 2021
None

## Education
Bachelor of Science in CS
Some University
Graduation Year: 2018

## Experience
### Acme Corp
Lead Developer
January 2020 - Present
Built scalable apps
Managed team
    `.trim();

    const result = parseResumeMarkdown(structured, inputData);
    expect(result.email).toBe("test@example.com");
    expect(result.summary).toContain("Full stack developer");
    expect(result.skills).toContain("JavaScript");
    expect(result.certifications[0].name).toBe("AWS Certified Developer");
    expect(result.education[0].institution).toBe("Some University");
    expect(result.experience[0].company).toBe("Acme Corp");
    expect(result.experience[0].responsibilities).toContain("Built scalable apps");
  });
});
