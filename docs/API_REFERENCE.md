# 📑 API Reference

This document outlines the backend REST API endpoints available in the CVitaePRO platform. All routes are prefixed with:

```
/api/
```

Authentication is handled via **JWT tokens** in the `Authorization` header using the `Bearer <token>` format.

---

## 🧾 Authentication Routes

### POST `/api/auth/register`

Registers a new user account.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "message": "User registered successfully."
}
```

---

### POST `/api/auth/login`

Authenticates an existing user and returns a JWT token.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "token": "jwt-token-here",
  "username": "string"
}
```

---

## 📄 Resume Routes

### POST `/api/resume/generate`

Generates a new resume based on user input and GPT-4o enhancements.

**Requires Auth**

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "linkedin": "string",
  "portfolio": "string",
  "summary": "string",
  "experience": [ ... ],
  "education": [ ... ],
  "skills": [ ... ],
  "certifications": [ ... ]
}
```

**Response:**
```json
{
  "resumeId": "uuid",
  "message": "Resume generated and saved successfully."
}
```

---

### POST `/api/resume/enhance`

Enhances an uploaded resume (PDF or DOCX) using OpenAI.

**Requires Auth**  
**Form Data:** `file` (PDF or DOCX)

**Response:**
```json
{
  "enhancedMarkdown": "string",
  "structuredResume": { ... }
}
```

---

### GET `/api/resume/download/:id`

Downloads a resume by ID in PDF format.

**Requires Auth**

**Response:**  
Returns a binary `application/pdf` stream.

---

### DELETE `/api/resume/:id`

Deletes a specific resume.

**Requires Auth**

**Response:**
```json
{
  "message": "Resume deleted."
}
```

---

## ✉️ Cover Letter Routes

### POST `/api/cover-letter/generate`

Generates a personalized cover letter using resume data and job description.

**Requires Auth**

**Request Body:**
```json
{
  "resumeId": "uuid",
  "jobDescription": "string",
  "customization": "string",
  "applicantAddress": "string",
  "companyAddress": "string",
  "date": "string"
}
```

**Response:**
```json
{
  "coverLetter": "string"
}
```

---

## 🧠 ATS Scoring Routes

### POST `/api/ats/score-resume`

Scores a resume against a job description using ATS criteria.

**Requires Auth**

**Request Body:**
```json
{
  "resumeHtml": "string",
  "jobDescription": "string"
}
```

**Response:**
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

## 📂 Upload Parsing Routes

### POST `/api/resume/parse-pdf`

Parses a PDF file and returns extracted text for enhancement.

**Requires Auth**  
**Form Data:** `file` (PDF)

**Response:**
```json
{
  "rawText": "string"
}
```

---

## 🔒 Notes

- All endpoints that modify or generate content require authentication.
- Token should be sent via `Authorization: Bearer <token>`.
- Rate limits are enforced per user to control OpenAI usage.

---

## 📌 Status

This API reference will be updated as new endpoints are introduced or modified.

