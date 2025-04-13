import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import GenerateCoverLetter from "./GenerateCoverLetter";
import { vi } from "vitest";
import { AuthContext } from "../context/AuthContext";

// ✅ Mock logout function
const mockLogout = vi.fn();

// ✅ Wrap component in AuthContext
const MockAuthProvider = ({ children }: { children: React.ReactNode }) => (
  <AuthContext.Provider
    value={{
      logout: mockLogout,
      login: vi.fn(),
      register: vi.fn(),
      user: "testUser",
      token: "",
    }}
  >
    {children}
  </AuthContext.Provider>
);

describe("GenerateCoverLetter", () => {
  const mockCoverLetterText = "Dear Hiring Manager,\n\nThis is a sample cover letter.";

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("fills form, submits, generates, and downloads cover letter", async () => {
    // ✅ Mock generation response
    vi.spyOn(global, "fetch").mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ coverLetter: mockCoverLetterText }),
      } as Response)
    );

    render(
      <MemoryRouter>
        <MockAuthProvider>
          <GenerateCoverLetter />
        </MockAuthProvider>
      </MemoryRouter>
    );

    // Fill form fields
    fireEvent.change(screen.getByLabelText(/Job Title/i), {
      target: { value: "Frontend Engineer" },
    });
    fireEvent.change(screen.getByLabelText(/Company Name/i), {
      target: { value: "CVitaePRO Inc" },
    });
    fireEvent.change(screen.getByLabelText(/Your Name/i), {
      target: { value: "Nathan Green" },
    });
    fireEvent.change(screen.getByLabelText(/Your Email/i), {
      target: { value: "nathan@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Phone Number/i), {
      target: { value: "555-555-1234" },
    });
    fireEvent.change(screen.getByLabelText(/Paste Your Resume/i), {
      target: { value: "Skilled frontend dev with React and TypeScript" },
    });
    fireEvent.change(screen.getByLabelText(/Focus Areas/i), {
      target: { value: "collaboration, design systems" },
    });

    // ✅ Submit form (button match fix)
    fireEvent.click(screen.getByRole("button", { name: /Generate Cover Letter/i }));

    // Wait for letter to render
    await waitFor(() => {
      expect(screen.getByText(/Dear Hiring Manager/i)).toBeInTheDocument();
    });

    // ✅ Verify Download PDF
    const downloadPdfBtn = screen.getByText(/Download PDF/i);
    expect(downloadPdfBtn).toBeInTheDocument();

    vi.spyOn(global, "fetch").mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        headers: {
          get: () => "application/pdf",
        },
        blob: () => Promise.resolve(new Blob(["test"], { type: "application/pdf" })),
      } as unknown as Response)
    );

    fireEvent.click(downloadPdfBtn);
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/cover-letter/download",
        expect.objectContaining({ method: "POST" })
      );
    });

    // ✅ Verify Download .docx
    vi.spyOn(global, "fetch").mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        blob: () => Promise.resolve(
          new Blob(["test"], {
            type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          })
        ),
      } as Response)
    );

    const downloadDocxBtn = screen.getByText(/Download .docx/i);
    fireEvent.click(downloadDocxBtn);
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/cover-letter/download-docx",
        expect.objectContaining({ method: "POST" })
      );
    });
  });

  it("displays error when cover letter generation fails", async () => {
    // ❌ Error response mock
    vi.spyOn(global, "fetch").mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: "Invalid input" }),
      } as Response)
    );

    render(
      <MemoryRouter>
        <MockAuthProvider>
          <GenerateCoverLetter />
        </MockAuthProvider>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Job Title/i), {
      target: { value: "Engineer" },
    });

    // ✅ Fix: scope to the correct button
    fireEvent.click(screen.getByRole("button", { name: /Generate Cover Letter/i }));

    await waitFor(() => {
      expect(screen.getByText(/Invalid input/i)).toBeInTheDocument();
    });
  });
});
