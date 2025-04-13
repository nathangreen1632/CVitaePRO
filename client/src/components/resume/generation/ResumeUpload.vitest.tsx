import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, fireEvent, waitFor } from "@testing-library/react";
import ResumeUpload from "./ResumeUpload";


// ✅ Mock mammoth
vi.mock("mammoth", () => ({
  default: {
    extractRawText: vi.fn(() => Promise.resolve({ value: "Extracted DOCX content" })),
  },
}));

// ✅ Mock fetch
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ text: "Extracted PDF content" }),
  })
) as unknown as typeof fetch;

describe("ResumeUpload", () => {
  let onParse: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onParse = vi.fn();
    vi.clearAllMocks();
  });

  it("parses DOCX file and calls onParse with text", async () => {
    const { getByLabelText } = render(<ResumeUpload onParse={onParse} />);

    const file = new File(["mock docx content"], "resume.docx", {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });

    const input = getByLabelText("Upload Document") as HTMLInputElement;
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(onParse).toHaveBeenCalledWith("Extracted DOCX content");
    });
  });

  it("parses PDF file and calls onParse with backend text", async () => {
    const { getByLabelText } = render(<ResumeUpload onParse={onParse} />);

    const file = new File(["mock pdf content"], "resume.pdf", {
      type: "application/pdf",
    });

    const input = getByLabelText("Upload Document") as HTMLInputElement;
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(onParse).toHaveBeenCalledWith("Extracted PDF content");
    });
  });

  it("displays error for unsupported file format", async () => {
    const { getByText, getByLabelText } = render(<ResumeUpload onParse={onParse} />);

    const file = new File(["random"], "resume.txt", { type: "text/plain" });

    const input = getByLabelText("Upload Document") as HTMLInputElement;
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(getByText("Unsupported file format. Please upload a PDF or DOCX.")).toBeInTheDocument();
    });
  });
});
