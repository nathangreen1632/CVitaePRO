import React from "react";
import { renderHook, act } from "@testing-library/react";
import { useDashboardState } from "./useDashboardState";

describe("useDashboardState", () => {
  it("should initialize with correct default values", () => {
    const { result } = renderHook(() => useDashboardState());

    expect(result.current.resumes).toEqual([]);
    expect(result.current.activityLog).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.atsScores).toEqual({});
    expect(result.current.jobDescriptions).toEqual({});
    expect(result.current.resumeData).toEqual({
      name: "",
      email: "",
      phone: "",
      linkedin: "",
      portfolio: "",
      summary: "",
      experience: [],
      education: [],
      skills: [],
      certifications: [],
    });
  });

  it("should update resumes", () => {
    const { result } = renderHook(() => useDashboardState());
    const testResumes = [{ id: "1", name: "John", jobTitle: "Dev", resumeSnippet: "snippet", summary: "summary", email: "john@test.com", phone: "1234567890", linkedin: "linkedin.com/in/john", portfolio: "john.com", experience: [], education: [], skills: [], certifications: [] }];

    act(() => {
      result.current.setResumes(testResumes);
    });

    expect(result.current.resumes).toEqual(testResumes);
  });

  it("should update activityLog", () => {
    const { result } = renderHook(() => useDashboardState());
    act(() => {
      result.current.setActivityLog(["Resume Created"]);
    });
    expect(result.current.activityLog).toEqual(["Resume Created"]);
  });

  it("should update loading state", () => {
    const { result } = renderHook(() => useDashboardState());
    act(() => {
      result.current.setLoading(true);
    });
    expect(result.current.loading).toBe(true);
  });

  it("should update error state", () => {
    const { result } = renderHook(() => useDashboardState());
    act(() => {
      result.current.setError("Something went wrong");
    });
    expect(result.current.error).toBe("Something went wrong");
  });

  it("should update atsScores", () => {
    const { result } = renderHook(() => useDashboardState());
    const mockScores = {
      "1": {
        atsScore: 80,
        keywordMatch: 70,
        softSkillsMatch: 60,
        industryTermsMatch: 90,
        formattingErrors: [],
      },
    };
    act(() => {
      result.current.setAtsScores(mockScores);
    });
    expect(result.current.atsScores).toEqual(mockScores);
  });

  it("should update jobDescriptions", () => {
    const { result } = renderHook(() => useDashboardState());
    const mockJobDescriptions = {
      "1": "Frontend Developer role at Example Co.",
    };
    act(() => {
      result.current.setJobDescriptions(mockJobDescriptions);
    });
    expect(result.current.jobDescriptions).toEqual(mockJobDescriptions);
  });

  it("should update resumeData with handleChange", () => {
    const { result } = renderHook(() => useDashboardState());

    const mockEvent = {
      target: {
        name: "name",
        value: "Jane Doe",
      },
    } as React.ChangeEvent<HTMLInputElement>;

    act(() => {
      result.current.handleChange(mockEvent);
    });

    expect(result.current.resumeData.name).toBe("Jane Doe");
  });
});
