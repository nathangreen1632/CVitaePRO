# API Reference

This document outlines the backend REST API endpoints available in the CVitaePRO platform. All routes are prefixed with:

```
/api/
```

Authentication is handled via **JWT tokens** in the `Authorization` header using the `Bearer <token>` format.

---

## Authentication Routes

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

## Resume Routes

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

## Cover Letter Routes

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

## ATS Scoring Routes

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

## Upload Parsing Routes

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

### Full Routes List

The backend of CVitaePRO is organized into modular Express routes for clarity, security, and maintainability. Below is a complete breakdown of all API endpoints.

---

#### User Authentication
Handles registration, login, logout, and password updates.

| Method | Route              | Purpose                          |
|--------|--------------------|----------------------------------|
| POST   | `/register`        | Register a new user              |
| POST   | `/login`           | Log in and receive JWT token     |
| POST   | `/logout`          | Invalidate JWT and log out       |
| POST   | `/change-password` | Change user password securely    |

---

#### Resume Uploading, Parsing, Processing, Enhancing, and Downloading
Handles the full resume lifecycle: uploading, processing, enhancing with AI, and downloading in multiple formats.

| Method | Route                 | Purpose                                                    |
|--------|-----------------------|------------------------------------------------------------|
| POST   | `/generate`           | Generate a new resume via OpenAI from form data            |
| POST   | `/upload`             | Upload a resume file (PDF or DOCX)                         |
| POST   | `/process`            | Process and store uploaded resume metadata                 |
| POST   | `/enhance`            | Enhance an existing resume using OpenAI                    |
| POST   | `/download`           | Download the enhanced resume from the Resume Editor as PDF |
| POST   | `/download-docx`      | Download the enhanced resume from the Resume Editor as DOCX|
| POST   | `/parse-pdf`          | Extract structured text from uploaded PDF resume           |
| GET    | `/list`               | List all resumes belonging to the authenticated user       |
| GET    | `/:id`                | Fetch a specific resume by ID                              |
| GET    | `/:id/download`       | Download a stored resume by ID as a PDF                    |
| DELETE | `/:resumeId`          | Delete a resume by ID from the database                    |

___

#### ATS (Applicant Tracking System) Scoring
Provides AI-powered scoring of resume compatibility with job descriptions.

| Method | Route             | Purpose                                     |
|--------|-------------------|---------------------------------------------|
| POST   | `/score-resume`   | Generate ATS score based on job description |

---

#### Cover Letter Generation
Handles OpenAI-based cover letter generation using resume + job inputs.

| Method | Route                 | Purpose                          |
|--------|-----------------------|----------------------------------|
| POST   | `/generate`           | Generate a tailored cover letter |

---

#### Resume AI Generation & Enhancement
Enhance or create resumes using GPT-4o based on user input or uploads.

| Method | Route                  | Purpose                             |
|--------|------------------------|-------------------------------------|
| POST   | `/generate-resume`     | Generate a new resume via OpenAI    |
| POST   | `/enhance-resume`      | Enhance an uploaded or existing resume |

---

#### Adobe PDF Extract Integration
Supports robust PDF text extraction using Adobe’s official API.

| Method | Route               | Purpose                              |
|--------|---------------------|--------------------------------------|
| POST   | `/extract-text`     | Extract clean text from a PDF resume |

---

#### Global Route Handling
Includes a global wildcard route for serving client-side routing fallback (e.g., for React SPA).

| Method | Route | Purpose                           |
|--------|-------|-----------------------------------|
| GET    | `*`   | Fallback for unmatched routes     |

---


## Notes

- All endpoints that modify or generate content require authentication.
- Token should be sent via `Authorization: Bearer <token>`.
- Rate limits are enforced per user to control OpenAI usage.

---

## Status

This API reference will be updated as new endpoints are introduced or modified.

