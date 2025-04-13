import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import GenerateResumeForm from "./GenerateResumeForm";

// Mocks
vi.mock("../../../hooks/useDashboardState.ts", () => ({
  useDashboardState: () => ({
    resumeData: {
      name: "Test User",
      email: "test@example.com",
      phone: "1234567890",
      summary: "Experienced dev",
      experience: [],
      education: [],
      skills: [],
      certifications: [],
    },
    setResumeData: vi.fn(),
    handleChange: vi.fn(),
    setActivityLog: vi.fn(),
    setLoading: vi.fn(),
    setError: vi.fn(),
  }),
}));

const mockHandleGenerateResume = vi.fn(() => Promise.resolve());

vi.mock("../../../helpers/resumeHandlers.ts", () => ({
  handleGenerateResume: () => mockHandleGenerateResume(),
}));

vi.mock("../formSections/ResumeDetailsForm.tsx", () => ({
  default: ({ handleGenerateResume }: { handleGenerateResume: () => void }) => (
    <button onClick={handleGenerateResume}>Submit Resume</button>
  ),
}));

describe("GenerateResumeForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the form and calls handleGenerateResume on submit", async () => {
    const { getByText } = render(
      <MemoryRouter>
        <GenerateResumeForm />
      </MemoryRouter>
    );

    const submitBtn = getByText("Submit Resume");
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockHandleGenerateResume).toHaveBeenCalled();
    });
  });

  it("shows loading overlay when generating", async () => {
    let resolveResume: () => void;

    mockHandleGenerateResume.mockImplementationOnce(() => {
      return new Promise<void>((resolve) => {
        resolveResume = resolve;
      });
    });

    const { getByText, queryByText } = render(
      <MemoryRouter>
        <GenerateResumeForm />
      </MemoryRouter>
    );

    fireEvent.click(getByText("Submit Resume"));

    // Loader should appear
    await waitFor(() => {
      expect(getByText("Generating Your Resume...")).toBeInTheDocument();
    });

    // Finish async
    resolveResume!();

    await waitFor(() => {
      expect(queryByText("Generating Your Resume...")).not.toBeInTheDocument();
    });
  });
});
