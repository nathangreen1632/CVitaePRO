import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ResumeEditor from "./ResumeEditor";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import { AuthContext } from "../context/AuthContext";

// ✅ Mock AuthContext
const mockLogout = vi.fn();
const MockAuthProvider = ({ children }: { children: React.ReactNode }) => (
  <AuthContext.Provider
    value={{
      logout: mockLogout,
      login: vi.fn(),
      register: vi.fn(),
      user: "testUser",
      token: "mock-token",
    }}
  >
    {children}
  </AuthContext.Provider>
);

// ✅ Mock ResumeUpload
vi.mock("../components/resume/generation/ResumeUpload.tsx", () => ({
  __esModule: true,
  default: ({ onParse }: { onParse: (text: string) => void }) => (
    <button onClick={() => onParse("Parsed resume content")} data-testid="mock-upload">
      Mock Upload
    </button>
  ),
}));

describe("ResumeEditor", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    localStorage.setItem("token", "mock-token");
  });

  it("renders the editor page", () => {
    render(
      <MemoryRouter>
        <MockAuthProvider>
          <ResumeEditor />
        </MockAuthProvider>
      </MemoryRouter>
    );

    // ✅ Use role for heading with exact title
    expect(screen.getByRole("heading", { name: "Resume Editor" })).toBeInTheDocument();

    // ✅ Label for screen reader aria-label
    expect(screen.getByLabelText("Editor Page")).toBeInTheDocument();

    // ✅ Confirm mock upload rendered
    expect(screen.getByTestId("mock-upload")).toBeInTheDocument();
  });

  it("shows error if no resume uploaded when enhancing", async () => {
    render(
      <MemoryRouter>
        <MockAuthProvider>
          <ResumeEditor />
        </MockAuthProvider>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Enhance"));

    await waitFor(() => {
      expect(screen.getByText(/Please upload and parse a resume/i)).toBeInTheDocument();
    });
  });

  it("handles enhance flow successfully", async () => {
    vi.spyOn(global, "fetch").mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ resume: { summary: "Enhanced summary content" } }),
      } as Response)
    );

    render(
      <MemoryRouter>
        <MockAuthProvider>
          <ResumeEditor />
        </MockAuthProvider>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByTestId("mock-upload"));
    fireEvent.click(screen.getByText("Summarize"));

    await waitFor(() => {
      expect(screen.getByDisplayValue("Enhanced summary content")).toBeInTheDocument();
    });
  });

  it("downloads PDF when button clicked", async () => {
    vi.spyOn(global, "fetch").mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        headers: {
          get: () => "application/pdf",
        },
        blob: () => Promise.resolve(new Blob(["PDF content"], { type: "application/pdf" })),
      } as unknown as Response)
    );

    render(
      <MemoryRouter>
        <MockAuthProvider>
          <ResumeEditor />
        </MockAuthProvider>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByTestId("mock-upload"));
    fireEvent.change(
      screen.getByLabelText("Resume and cover letter editor. Enter or modify your content here."),
      { target: { value: "Enhanced summary content" } }
    );

    fireEvent.click(screen.getByText(/Download PDF/i));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/resume/download",
        expect.objectContaining({ method: "POST" })
      );
    });
  });

  it("downloads DOCX when button clicked", async () => {
    vi.spyOn(global, "fetch").mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        blob: () =>
          Promise.resolve(
            new Blob(["DOCX content"], {
              type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            })
          ),
      } as Response)
    );

    render(
      <MemoryRouter>
        <MockAuthProvider>
          <ResumeEditor />
        </MockAuthProvider>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByTestId("mock-upload"));
    fireEvent.change(
      screen.getByLabelText("Resume and cover letter editor. Enter or modify your content here."),
      { target: { value: "Enhanced summary content" } }
    );

    fireEvent.click(screen.getByText(/Download DOCX/i));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/resume/download-docx",
        expect.objectContaining({ method: "POST" })
      );
    });
  });
});
