import { describe, it, expect, vi, beforeEach } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import CertificationsSection from "./CertificationsSection";

describe("CertificationsSection", () => {
  let resumeData: any;
  let setResumeData: import('vitest').Mock;

  beforeEach(() => {
    resumeData = {
      certifications: [],
      currentCertificationName: "",
      currentCertificationYear: "",
    };
    setResumeData = vi.fn((updater) => {
      resumeData = typeof updater === "function" ? updater(resumeData) : updater;
    });
  });

  const renderComponent = () =>
    render(<CertificationsSection resumeData={resumeData} setResumeData={setResumeData}/>);

  it("renders input fields and add button", () => {
    renderComponent();
    expect(screen.getByPlaceholderText("Certification Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Year")).toBeInTheDocument();
    expect(screen.getByText("Add")).toBeInTheDocument();
  });

  it("updates name and year inputs", () => {
    renderComponent();

    fireEvent.change(screen.getByPlaceholderText("Certification Name"), {
      target: {value: "AWS Certified"},
    });
    fireEvent.change(screen.getByPlaceholderText("Year"), {
      target: {value: "2023"},
    });

    expect(setResumeData).toHaveBeenCalledTimes(2);
  });

  it("adds certification on Add button click", () => {
    resumeData.currentCertificationName = "CompTIA Security+";
    resumeData.currentCertificationYear = "2022";
    renderComponent();

    fireEvent.click(screen.getByText("Add"));

    expect(setResumeData).toHaveBeenCalledWith(expect.any(Function));
    const updated = setResumeData.mock.calls[0][0](resumeData);
    expect(updated.certifications).toContainEqual({name: "CompTIA Security+", year: "2022"});
    expect(updated.currentCertificationName).toBe("");
    expect(updated.currentCertificationYear).toBe("");
  });

  it("adds certification on Enter key press", () => {
    resumeData.currentCertificationName = "PMP";
    resumeData.currentCertificationYear = "2021";
    renderComponent();

    fireEvent.keyDown(screen.getByPlaceholderText("Certification Name"), {key: "Enter"});

    expect(setResumeData).toHaveBeenCalledWith(expect.any(Function));
    const updated = setResumeData.mock.calls[0][0](resumeData);
    expect(updated.certifications).toContainEqual({name: "PMP", year: "2021"});
  });

  it("does not add certification if name or year is missing", () => {
    resumeData.currentCertificationName = "CISSP";
    resumeData.currentCertificationYear = "";
    renderComponent();

    fireEvent.click(screen.getByText("Add"));

    expect(setResumeData).toHaveBeenCalledTimes(0);
  });

  it("removes certification on ❌ button click", () => {
    resumeData.certifications = [
      {name: "Google Cloud Cert", year: "2020"},
      {name: "Linux+", year: "2019"},
    ];

    const cloned = JSON.parse(JSON.stringify(resumeData)); // snapshot
    renderComponent();

    fireEvent.click(screen.getAllByText("❌")[0]);

    expect(setResumeData).toHaveBeenCalledWith(expect.any(Function));

    // ✅ Fix: wrap everything in the block properly
    const updated = setResumeData.mock.calls[0][0](cloned);

    expect(updated.certifications).toEqual([{name: "Linux+", year: "2019"}]);
  });

});
