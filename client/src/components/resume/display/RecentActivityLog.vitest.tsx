import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import RecentActivityLog from "./RecentActivityLog";

describe("RecentActivityLog", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("displays a message when there is no recent activity", () => {
    const { getByText } = render(<RecentActivityLog activityLog={[]} />);
    expect(getByText("No recent activity yet.")).toBeInTheDocument();
  });

  it("renders generated and edited resume items", () => {
    const activityLog = [
      "Generated Resume - Marketing Manager",
      "Edited Resume - Frontend Developer"
    ];
    const { getByText } = render(<RecentActivityLog activityLog={activityLog} />);
    expect(getByText("Generated Resume -")).toBeInTheDocument();
    expect(getByText("Marketing Manager")).toBeInTheDocument();
    expect(getByText("Edited Resume -")).toBeInTheDocument();
    expect(getByText("Frontend Developer")).toBeInTheDocument();
  });

  it("calls scrollToResume on button click", () => {
    const activityLog = ["Generated Resume - Marketing Manager"];

    const scrollSpy = vi.fn();
    HTMLElement.prototype.scrollIntoView = scrollSpy;

    const mockElement = document.createElement("div");
    mockElement.id = "resume-card-Marketing-Manager";
    document.body.appendChild(mockElement);

    const { getByText } = render(<RecentActivityLog activityLog={activityLog} />);

    fireEvent.click(getByText("Generated Resume -"));

    expect(scrollSpy).toHaveBeenCalledWith({ behavior: "smooth", block: "start" });

    document.body.removeChild(mockElement);
  });
});
