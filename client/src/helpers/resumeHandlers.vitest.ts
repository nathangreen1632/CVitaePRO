import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  convertResumeToHTML,
  handleGenerateResume,
  handleEnhanceResume,
  handleScoreResume
} from "./resumeHandlers";

import { parseResumeMarkdown } from "./parseResumeMarkdown";

// Mocks
vi.mock("./parseResumeMarkdown", () => ({
  parseResumeMarkdown: vi.fn(() => ({
    name: "Enhanced Name",
    summary: "Enhanced summary",
  })),
}));

vi.mock("./buildOpenAIPayload", () => ({
  buildOpenAIPayload: vi.fn(() => "Mocked resume string for OpenAI"),
}));

// Environment Setup
beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn());
  localStorage.clear();
});

afterEach(() => {
  vi.resetAllMocks();
});

const mockResumeData = {
  name: "John Doe",
  email: "john@example.com",
  phone: "555-555-5555",
  linkedin: "linkedin.com/in/johndoe",
  portfolio: "johndoe.dev",
  summary: "Summary...",
  experience: [],
  education: [],
  skills: [],
  certifications: [],
};

// ------------------------------
// TEST: convertResumeToHTML
// ------------------------------
describe("convertResumeToHTML", () => {
  it("renders contact, summary, skills, etc.", () => {
    const html = convertResumeToHTML(mockResumeData);
    expect(html).toContain("Contact Information");
    expect(html).toContain("John Doe");
  });
});

// ------------------------------
// TEST: handleGenerateResume
// ------------------------------
describe("handleGenerateResume", () => {
  it("calls /api/resume/generate and updates localStorage", async () => {
    const mockFetchResumes = vi.fn();
    const mockSetLoading = vi.fn();
    const mockSetError = vi.fn();
    const mockSetActivityLog = vi.fn();

    vi.stubGlobal("fetch", vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      })
    ));

    await handleGenerateResume({
      resumeData: mockResumeData,
      setLoading: mockSetLoading,
      setError: mockSetError,
      setActivityLog: mockSetActivityLog,
      fetchResumes: mockFetchResumes,
    });

    expect(mockSetLoading).toHaveBeenCalledWith(true);
    expect(mockSetError).toHaveBeenCalledWith(null);
    expect(mockFetchResumes).toHaveBeenCalled();
    expect(mockSetActivityLog).toHaveBeenCalledWith(
      expect.arrayContaining(["Generated Resume - John Doe"])
    );
  });
});

// ------------------------------
// TEST: handleEnhanceResume
// ------------------------------
describe("handleEnhanceResume", () => {
  it("enhances resume and logs activity", async () => {
    const mockSetLoading = vi.fn();
    const mockSetError = vi.fn();
    const mockSetActivityLog = vi.fn();

    vi.stubGlobal("fetch", vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            resume: "```json\n{\"name\": \"Enhanced Name\", \"summary\": \"Enhanced summary\"}\n```",
          }),
      })
    ));

    await handleEnhanceResume({
      resumeData: mockResumeData,
      setLoading: mockSetLoading,
      setError: mockSetError,
      setActivityLog: mockSetActivityLog,
    });

    expect(mockSetLoading).toHaveBeenCalledWith(true);
    expect(mockSetError).toHaveBeenCalledWith(null);
    expect(parseResumeMarkdown).toHaveBeenCalled();
    expect(mockSetActivityLog).toHaveBeenCalledWith(
      expect.arrayContaining(["Enhanced Resume - Enhanced Name"])
    );
  });
});

// ------------------------------
// TEST: handleScoreResume
// ------------------------------
describe("handleScoreResume", () => {
  const mockResumeId = "12345";
  const mockHTML = "<p>Mock resume content</p>";
  const mockJobDescription =
    "Senior frontend engineer with React and TypeScript experience. Looking for a candidate with strong problem-solving skills and a passion for clean code.";

  let setAtsScoresSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    localStorage.setItem("resumes", JSON.stringify([{ id: mockResumeId }]));

    vi.stubGlobal("fetch", vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            atsScore: 50,
            keywordMatch: 50,
            softSkillsMatch: 60,
            industryTermsMatch: 50,
            formattingErrors: ["Missing contact info"],
          }),
      })
    ));

    setAtsScoresSpy = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
    setAtsScoresSpy.mockClear();
  });

  it("sets ATS score with dynamic values when job description is valid", async () => {
    await handleScoreResume({
      resumeId: mockResumeId,
      htmlResume: mockHTML,
      jobDescription: mockJobDescription,
      setAtsScores: setAtsScoresSpy,
    });

    // It should be called exactly once
    expect(setAtsScoresSpy).toHaveBeenCalledTimes(1);

    // It should be called with a function updater, not an object
    expect(setAtsScoresSpy).toHaveBeenCalledWith(expect.any(Function));

    // Call the updater manually and test the result if needed:
    const updaterFn = setAtsScoresSpy.mock.calls[0][0];
    const result = updaterFn({}); // simulate previous state

    expect(result).toEqual(
      expect.objectContaining({
        [mockResumeId]: expect.objectContaining({
          atsScore: 50,
          keywordMatch: 50,
          softSkillsMatch: 60,
          industryTermsMatch: 50,
          formattingErrors: ["Missing contact info"],
        }),
      })
    );
  });
});