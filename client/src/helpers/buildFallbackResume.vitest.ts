import { describe, it, expect } from "vitest";
import { buildFallbackResume } from "./buildFallbackResume";

describe("buildFallbackResume", () => {
  const fullInput = {
    name: "Jane Doe",
    email: "jane@example.com",
    phone: "123-456-7890",
    linkedin: "linkedin.com/in/janedoe",
    portfolio: "janedoe.dev",
    summary: "Skilled developer",
    experience: [{ company: "Company A", role: "Dev" }],
    education: [{ institution: "Uni", degree: "CS" }],
    skills: ["TypeScript", "React"],
    certifications: [{ name: "Cert A", year: "2022" }]
  };

  it("returns complete data when input is complete", () => {
    const result = buildFallbackResume(fullInput);
    expect(result.name).toBe("Jane Doe");
    expect(result.email).toBe("jane@example.com");
    expect(result.phone).toBe("123-456-7890");
    expect(result.linkedin).toBe("linkedin.com/in/janedoe");
    expect(result.portfolio).toBe("janedoe.dev");
    expect(result.summary).toBe("Skilled developer");
    expect(result.experience).toEqual([{ company: "Company A", role: "Dev" }]);
    expect(result.education).toEqual([{ institution: "Uni", degree: "CS" }]);
    expect(result.skills).toContain("TypeScript");
    expect(result.certifications[0].name).toBe("Cert A");
  });

  it("falls back to defaults when input is empty", () => {
    const result = buildFallbackResume({});
    expect(result.name).toBe("");
    expect(result.email).toBe("");
    expect(result.phone).toBe("");
    expect(result.linkedin).toBe("");
    expect(result.portfolio).toBe("");
    expect(result.summary).toBe("");
    expect(result.experience).toEqual([]);
    expect(result.education).toEqual([]);
    expect(result.skills).toEqual([]);
    expect(result.certifications).toEqual([]);
  });

  it("uses input values when only some fields are present", () => {
    const partialInput = {
      name: "Test User",
      summary: "Summary here",
      skills: []
    };

    const result = buildFallbackResume(partialInput);
    expect(result.name).toBe("Test User");
    expect(result.summary).toBe("Summary here");
    expect(result.skills).toEqual([]); // updated expectation
    expect(result.email).toBe("");
  });
});
