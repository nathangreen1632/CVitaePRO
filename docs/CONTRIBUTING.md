# CONTRIBUTING

## Welcome

Thank you for your interest in contributing to **CVitaePRO** — an AI-powered resume and cover letter platform built for real-world impact.

This guide outlines the standards, practices, and workflow required to contribute code, documentation, or feedback. All contributors are expected to follow this format to ensure consistency, quality, and clean collaboration.

---

## Project Structure

```
CVitaePRO/
├── client/        → React frontend (Vite + TypeScript)
├── server/        → Node.js backend (Express + PostgreSQL)
├── docs/          → Project documentation
├── register/      → Logging system (was /logs/)
├── scripts/       → CLI tools and test scripts
```

---

## Contribution Workflow

1. **Fork the repository**

2. **Create a feature branch**

```
git checkout -b feature/my-feature-name
```

3. **Make your changes**

- Write clean, modular code
- Follow strict TypeScript rules (`no any`, `no null`, etc.)
- Use descriptive function names and comments
- Keep frontend logic and UI components separated

4. **Run lint and tests**

```
npm run lint
npm run test
```

5. **Commit using the standard format**

```
(feature: action) short description
```

**Examples:**
```
(auth: add) JWT middleware for protected routes
(resume: fix) correct date formatting in PDF export
(docs: update) add ATS scoring explanation
```

6. **Push your branch**

```
git push origin feature/my-feature-name
```

7. **Open a pull request (PR)**

- Provide a clear title and description
- Reference any related issue IDs
- Use GitHub checklists to show what's completed

---

## Rules for Authenticated Routes

- All protected routes must verify JWT tokens via middleware
- Never leak sensitive data (e.g., passwords, API keys)
- Use environment variables for all config values

---

## Code Style

- Tabs: 2 spaces
- Language: TypeScript (strict mode)
- Component Style: Functional + Hooks
- Avoid: `any`, `null`, `unknown`, or magic numbers
- Use `AuthContext` and props for all stateful components
- Keep database logic out of controllers (use services)

---

## Docs & Markdown

- All new features must be documented in `/docs/`
- Use 110% Markdown only (no syntax highlighting, no mixed formats)
- Keep files under 500 lines each when possible
- Avoid emojis inside code blocks or logic output

---

## Contact

For major features or architecture discussions, please open a GitHub Discussion or tag `@nathangreen1632` directly in your PR.

---

## Feedback

- Bugs? → Open an Issue
- Suggestions? → Use Discussions
- Questions? → Start a thread in the repo chat or Discord (if linked)

We’re building CVitaePRO to help people land better jobs — thanks for being part of that mission.
