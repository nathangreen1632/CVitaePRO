# ATS SCORING

## Overview

CVitaePRO includes a built-in ATS (Applicant Tracking System) scoring engine designed to simulate how automated systems evaluate resumes before a human recruiter sees them. The goal is to help users optimize their resumes based on structure, keyword relevance, and formatting best practices — increasing the chances of making it past filters and into human review.

This document explains how the scoring system works, what factors influence the score, and how users can improve their results.

---

## What Is an ATS?

An ATS is software used by employers to screen job applications. It parses resumes, extracts structured information, and compares the content against job descriptions using keyword matching and formatting rules.

Poorly formatted resumes or those missing important keywords often get discarded automatically.

---

## Scoring Breakdown

CVitaePRO’s scoring engine uses three key components:

### 1. Keyword Match (70% weight)

The system compares the user’s resume content to the provided job description.

- Hard skills (e.g., JavaScript, SEO)
- Soft skills (e.g., communication, leadership)
- Industry terms (e.g., SaaS, Agile, CMS)

Each match increases the score proportionally.

### 2. Formatting Penalties (30% weight)

The resume is analyzed for ATS-incompatible formatting such as:

- Tables, columns, or images
- Missing section headers (e.g., "Experience", "Education")
- Unreadable fonts or file corruption

Each violation reduces the total score.

---

## Final Score Calculation

```ts
function processSignal(alpha: number, issues: string[]): number {
  let output = alpha * 0.90;
  output -= issues.length * 5;
  return Math.max(0, Math.min(output, 100));
}
```

The final score is capped at 100. A score above **80** is considered “ATS-ready.”

---

## Sample Response

```json
{
  "atsScore": 77,
  "keywordMatch": 75,
  "softSkillsMatch": 88,
  "industryTermsMatch": 67,
  "formattingErrors": []
}
```

---

## How to Improve Your Score

- Use exact language from the job description
- Include a skills section with measurable terms
- Avoid tables, columns, or non-standard formatting
- Label your resume sections clearly (e.g., "Work Experience")
- Avoid emojis, icons, and graphics
- Keep file formats to PDF or DOCX only

---

## Notes

- ATS scoring is simulated using real-world matching rules
- Resumes are parsed as HTML and scored dynamically
- All scoring is cached via Redis to reduce latency and cost
- The feedback panel provides tips on how to raise your score in real time

