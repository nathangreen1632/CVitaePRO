# 🎨 CVitaePRO Frontend

## Overview

This directory contains the frontend portion of the CVitaePRO platform — a responsive, TypeScript-based React application built with Vite and styled using Tailwind CSS.

The frontend serves as the user-facing interface for:
- Uploading resumes
- Generating AI-enhanced content
- Viewing ATS scoring results
- Managing authentication and user sessions
- Downloading resumes and cover letters in multiple formats

---

## 🧱 Tech Stack

- **React** (Vite)
- **TypeScript**
- **Tailwind CSS**
- **React Hook Form**
- **React Router DOM**
- **JWT-based Auth via Context**
- **State Management:** Prop drilling + Context API (no Redux)

---

## 📁 Folder Structure

```
/client
├── assets/           → Static images, logos, icons
├── components/       → Reusable React components (UI, forms, sections)
├── context/          → Global AuthContext provider
├── pages/            → Page-level components (Dashboard, Resume, Login, etc.)
├── services/         → Centralized API handlers (e.g., api.ts)
├── styles/           → Tailwind config or global CSS resets
├── types/            → TypeScript interfaces for shared data
├── main.tsx          → React root mount
└── App.tsx           → Route management + page layout
```

---

## 🔐 Authentication Strategy

- JWT token is stored in memory via AuthContext
- Login and registration handled through `/api/auth/*` endpoints
- Token is automatically attached to authenticated requests
- Protected pages redirect to `/login` if no valid session is detected

---

## 📄 Form Architecture

- Built using `React Hook Form` for data binding, validation, and error handling
- Form sections for resume creation include:
    - Personal Info
    - Experience
    - Education
    - Skills
    - Certifications
- Tag-style Add/Remove UI used for multi-item fields
- Resume form state is modular and lives inside controlled components

---

## 📥 API Integration

All external requests are handled through `/client/services/api.ts`, which includes:

- Login / Register
- Generate Resume
- Enhance Resume
- Score Resume (ATS)
- Generate Cover Letter
- Download as PDF / DOCX
- Delete Resume

Each function:
- Uses `fetch`
- Injects the token (if required)
- Accepts typed payloads
- Returns parsed response objects or errors

---

## 🌓 UI/UX Features

- Clean, modern layout with dark/light mode toggle
- Responsive mobile-first design
- Spline integration on landing pages and transitions
- Step-by-step resume builder with autosave to localStorage
- Feedback panel for ATS results and OpenAI status

---

## 🧪 Testing & Validation

Frontend testing is minimal but scoped for:
- Basic form validation rules
- Error handling for failed API calls
- Responsive layout behavior

*Full unit/integration testing to be expanded in future sprints.*

---

## 🧠 Developer Notes

- Use `AuthContext` for all token-aware logic
- Avoid using localStorage directly (except for autosave flows)
- Keep all API logic out of UI components
- Ensure all user inputs are validated before submission
- Use Tailwind classes for layout, spacing, and responsiveness

---

## 🚧 In Progress

- Template switching system for resumes
- Resume preview mode
- Public resume sharing URL generator
- Enhanced form validation using Zod
- Full UI accessibility audit (keyboard + screen reader)

---

## 🧾 Frontend Entry Point

```
src/main.tsx → Renders App.tsx
App.tsx → Handles routes, layout, and protected route logic
```

---

## 📦 Running Locally

To run the frontend in development mode:

```
cd client
npm install
npm run dev
```

Then open:

```
http://localhost:5173
```

---

## 🧼 Linting

All frontend code must conform to the project’s ESLint + Prettier rules.

```
npm run lint
```

---

## 💬 Need Help?

- Review `/docs/API_REFERENCE.md` to see what endpoints are available
- See `/docs/RESUME_STRUCTURE.md` for required object shapes
- Contact the maintainer or open a discussion if you encounter major blockers

