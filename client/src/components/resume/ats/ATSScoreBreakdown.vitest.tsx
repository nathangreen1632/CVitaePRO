
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import ATSScoreBreakdown from "./ATSScoreBreakdown";

// 🧪 Stub crypto.randomUUID to avoid issues in test env
beforeEach(() => {
  vi.stubGlobal("crypto", {
    randomUUID: vi.fn(() => "test-uuid"),
  });
});

describe("ATSScoreBreakdown", () => {
  const props = {
    atsScore: 74,
    keywordMatch: 24,
    softSkillsMatch: 22,
    industryTermsMatch: 18,
    formattingErrors: [],
  };

  it("renders the overall ATS score", () => {
    render(<ATSScoreBreakdown {...props} />);
    expect(screen.getByText("74%")).toBeInTheDocument();
  });

  it("renders all progress bars with correct labels and percentages", () => {
    render(<ATSScoreBreakdown {...props} />);
    expect(screen.getByText("Keyword Match")).toBeInTheDocument();
    expect(screen.getByText("80%")).toBeInTheDocument(); // 24/30
    expect(screen.getByText("Soft Skills Match")).toBeInTheDocument();
    expect(screen.getByText("79%")).toBeInTheDocument(); // 22/28
    expect(screen.getByText("Industry Terms Match")).toBeInTheDocument();
    expect(screen.getByText("90%")).toBeInTheDocument(); // 18/20
  });

  it("displays 'No formatting issues' when there are none", () => {
    render(<ATSScoreBreakdown {...props} />);
    expect(screen.getByText("No formatting issues detected.")).toBeInTheDocument();
  });

  it("displays a list of formatting errors when present", () => {
    const errorProps = {
      ...props,
      formattingErrors: ["Missing phone number", "Incorrect heading format"],
    };

    render(<ATSScoreBreakdown {...errorProps} />);
    expect(screen.getByText("Formatting Issues:")).toBeInTheDocument();
    expect(screen.getByText("Missing phone number")).toBeInTheDocument();
    expect(screen.getByText("Incorrect heading format")).toBeInTheDocument();
  });
});
