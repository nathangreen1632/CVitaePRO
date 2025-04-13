import { describe, it, expect } from "vitest";
import { convertResumeToHTML } from "./convertResumeToHTML";

describe("convertResumeToHTML", () => {
  const mockResume = {
    name: "John Doe",
    email: "john@example.com",
    phone: "123-456-7890",
    summary: "Experienced developer.\n```ts\nconsole.log('debug');\n```",
    experience: [
      {
        company: "Acme Inc.",
        role: "Software Engineer",
        start_date: "Jan 2020",
        end_date: "Present",
        responsibilities: ["Developed apps", "Led a team"],
      },
    ],
    education: [
      {
        institution: "University of Somewhere",
        degree: "BSc Computer Science",
        graduation_year: "2019",
      },
    ],
    skills: ["JavaScript", "TypeScript", "React"],
    certifications: [
      { name: "AWS Certified Developer", year: "2021" },
      { name: "Scrum Master", year: "2020" },
    ],
  };

  const html = convertResumeToHTML(mockResume);

  it("renders contact section correctly", () => {
    expect(html).toContain("<h1>John Doe</h1>");
    expect(html).toContain("Email: john@example.com");
    expect(html).toContain("Phone: 123-456-7890");
  });

  it("cleans code blocks from summary", () => {
    expect(html).toContain("<h2>Summary</h2>");
    expect(html).toContain("<p>Experienced developer.");
    expect(html).not.toContain("```");
  });

  it("renders experience section with roles and responsibilities", () => {
    expect(html).toContain("<h2>Experience</h2>");
    expect(html).toContain("<strong>Software Engineer</strong>");
    expect(html).toContain("at <em>Acme Inc.</em>");
    expect(html).toContain("<li>Developed apps</li>");
    expect(html).toContain("<li>Led a team</li>");
  });

  it("renders education section correctly", () => {
    expect(html).toContain("<h2>Education</h2>");
    expect(html).toContain("<strong>BSc Computer Science</strong>");
    expect(html).toContain("<em>University of Somewhere</em>");
    expect(html).toContain("Graduated: 2019");
  });

  it("renders skills as a list", () => {
    expect(html).toContain("<h2>Skills</h2>");
    expect(html).toContain("<li>JavaScript</li>");
    expect(html).toContain("<li>TypeScript</li>");
    expect(html).toContain("<li>React</li>");
  });

  it("renders certifications correctly", () => {
    expect(html).toContain("<h2>Certifications</h2>");
    expect(html).toContain("<li>AWS Certified Developer (2021)</li>");
    expect(html).toContain("<li>Scrum Master (2020)</li>");
  });
});
