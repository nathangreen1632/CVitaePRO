import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { vi } from "vitest"
import Dashboard from "./Dashboard"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth.ts"
import * as resumeHandlers from "../helpers/resumeHandlers"
import * as useDashboardState from "../hooks/useDashboardState"
import { AuthContext } from "../context/AuthContext" // ✅ Make sure this path matches your project


vi.mock("../hooks/useAuth.ts", () => ({
  useAuth: vi.fn()
}))

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom")
  return {
    ...actual,
    useNavigate: vi.fn()
  }
})

vi.mock("../helpers/resumeHandlers", () => ({
  handleEnhanceResume: vi.fn(),
  handleScoreResume: vi.fn()
}))

beforeAll(() => {
  vi.stubGlobal("matchMedia", () => ({
    matches: false,
    media: "",
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  }))
})

describe("Dashboard Component", () => {
  const mockNavigate = vi.fn()
  const mockEnhance = resumeHandlers.handleEnhanceResume as ReturnType<typeof vi.fn>
  const mockSetResumes = vi.fn()
  const mockSetActivityLog = vi.fn()
  const mockSetLoading = vi.fn()
  const mockSetError = vi.fn()

  const mockResume = {
    id: "abc123",
    name: "Sample Resume",
    jobTitle: "Frontend Developer",
    resumeSnippet: "",
    summary: "Frontend developer.",
    email: "test@example.com",
    phone: "1234567890",
    linkedin: "",
    portfolio: "",
    experience: [],
    education: [],
    skills: [],
    certifications: []
  }

  beforeEach(() => {
    vi.clearAllMocks()

    vi.mocked(useAuth).mockReturnValue({
      user: null,
      token: "mock-token",
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn()
    })

    vi.mocked(useNavigate).mockReturnValue(mockNavigate)

    vi.spyOn(useDashboardState, "useDashboardState").mockReturnValue({
      resumes: [mockResume],
      setResumes: mockSetResumes,
      activityLog: ["Generated Resume - Sample Resume"],
      setActivityLog: mockSetActivityLog,
      loading: false,
      setLoading: mockSetLoading,
      error: null,
      setError: mockSetError,
      atsScores: {},
      setAtsScores: vi.fn(),
      jobDescriptions: {},
      setJobDescriptions: vi.fn(),
      resumeData: mockResume,
      setResumeData: vi.fn(),
      handleChange: vi.fn()
    })
  })

  it("renders all resume features and handles interaction", async () => {
    render(
      <AuthContext.Provider
        value={{
          user: null,
          token: "mock-token",
          login: vi.fn(),
          register: vi.fn(),
          logout: vi.fn()
        }}
      >
        <Dashboard />
      </AuthContext.Provider>
    )

    const resumeTitles = await screen.findAllByText("Sample Resume")
    expect(resumeTitles.length).toBeGreaterThan(0)
    expect(
      screen.getByText((content, element) => {
        return (
          element?.tagName.toLowerCase() === "button" &&
          content.includes("Generated Resume") &&
          element.textContent?.includes("Sample Resume")
        ) || false;
      })
    ).toBeInTheDocument()


    fireEvent.click(screen.getByText("Enhance Resume"))
    await waitFor(() => {
      expect(mockEnhance).toHaveBeenCalled()
    })

    fireEvent.click(screen.getByText("Resume Form"))
    expect(mockNavigate).toHaveBeenCalledWith("/resume-form")

    fireEvent.click(screen.getByText("Download"))
    expect(await screen.findByText("Download PDF")).toBeInTheDocument()

    fireEvent.click(screen.getByText("Cancel"))
    await waitFor(() => {
      expect(screen.queryByText("Download PDF")).not.toBeInTheDocument()
    })

    const deleteButton = screen.getByRole("button", { name: /delete/i })
    fireEvent.click(deleteButton)

    await waitFor(() => {
      expect(mockSetLoading).toHaveBeenCalled()
    })
  })
})
