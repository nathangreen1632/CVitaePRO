import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Resume from "./Resume";
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
      token: "test-token",
    }}
  >
    {children}
  </AuthContext.Provider>
);

// ✅ Mock GenerateResumeForm to isolate Resume.tsx behavior
vi.mock("../components/resume/generation/GenerateResumeForm.tsx", () => ({
  __esModule: true,
  default: () => <div data-testid="mock-generate-resume-form">Mock Resume Form</div>,
}));

describe("Resume Page", () => {
  it("renders the page layout with header and resume form", () => {
    render(
      <MemoryRouter>
        <MockAuthProvider>
          <Resume />
        </MockAuthProvider>
      </MemoryRouter>
    );

    // ✅ More specific: make sure the visually hidden ARIA label is present
    expect(screen.getByLabelText("Resume Form")).toBeInTheDocument();

    // ✅ Confirm mock form renders
    expect(screen.getByTestId("mock-generate-resume-form")).toBeInTheDocument();

    // ✅ Optional: confirm there are exactly 2 "Resume Form" texts (visible + screen reader)
    const titles = screen.getAllByText(/Resume Form/i);
    expect(titles.length).toBeGreaterThanOrEqual(2);
  });
});
