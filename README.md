# <span id="top"> CVitaePRO </span>

[![CVitaePRO](https://img.shields.io/badge/CVitae-PRO-black?style=for-the-badge&labelColor=black&color=darkred&logo=none&logoColor=white)](http://cvitaepro.onrender.com)


[![License](https://img.shields.io/badge/License-none-darkred.svg)](docs/LICENSE.md)

**Project Status**

![Development](https://img.shields.io/badge/Development-Active-limegreen.svg)
![Build](https://img.shields.io/badge/Build-Passing-limegreen.svg)
![Deps](https://img.shields.io/badge/Deps-Up%20to%20date-limegreen.svg)
![Last Commit](https://img.shields.io/github/last-commit/nathangreen1632/CVitaePRO.svg)
![Issues](https://img.shields.io/github/issues/nathangreen1632/CVitaePRO.svg)

**Badges**

![Database](https://img.shields.io/badge/Database-PostgreSQL-blue.svg)
![ORM](https://img.shields.io/badge/ORM-Sequelize-blue.svg)
![Backend](https://img.shields.io/badge/Backend-Node.js-blue.svg)
![Frontend](https://img.shields.io/badge/Frontend-React-blue.svg)
![Language](https://img.shields.io/badge/Language-TypeScript-blue.svg)
![Framework](https://img.shields.io/badge/Framework-Express.js-blue.svg)
![API](https://img.shields.io/badge/API-REST-blue.svg)

**GitHub Stats**

![Stars](https://img.shields.io/github/stars/nathangreen1632/socialNetwork.svg)
![Forks](https://img.shields.io/github/forks/nathangreen1632/socialNetwork.svg)
![Followers](https://img.shields.io/github/followers/nathangreen1632.svg)


<details>
  <summary>Table of Contents</summary>

- [Synopsis](#-synopsis)
- [About](#-about)
- [Use Case](#-use-case)
- [Problems It Solves](#-problems-it-solves)
- [Key Features](#-key-features)
- [ATS Algorithm Overview](#-ats-algorithm-overview)
- [Technologies Used](#-technologies-used)
- [Installation](#-installation)
- [Usage](#-usage)
- [Contributing](#-contributing)
- [Supplemental Docs](#-supplemental-docs)
  - [License](docs/LICENSE.md)
  - [Business Proposal](docs/BusinessProposal.md)
  - [Client README](docs/CLIENT_README.md)
  - [API Reference](docs/API_REFERENCE.md)
  - [ATS Scoring](docs/ATS_SCORING.md)
  - [Resume Structure](docs/RESUME_STRUCTURE.md)
  - [Contributing](docs/CONTRIBUTING.md)
- [Future Enhancements](#-future-enhancements)
- [Repository](#-repository)
- [Conclusion](#-conclusion)

</details>

<div style="text-align: right;">
  <a href="#top">
    <img src="https://img.shields.io/badge/Back%20to%20Top-%E2%86%91-royalblue" alt="Back to Top">
  </a>
</div>

## 🧾 Synopsis

CVitaePRO is a next-generation, AI-powered platform that empowers job seekers to generate polished, professional, and recruiter-ready resumes and cover letters in minutes — not hours. Built to bridge the gap between human potential and hiring system algorithms, CVitaePRO streamlines the document creation process using GPT-4o, the most advanced natural language model available from OpenAI.

Traditional resume writing is time-consuming, overwhelming, and often misses the mark when it comes to modern hiring systems. Most applicants either struggle to express their value clearly or fail to format their documents for Applicant Tracking Systems (ATS), resulting in missed opportunities and automated rejections.

CVitaePRO eliminates those barriers by combining personalized AI content generation, real-time ATS optimization, and a dynamic user interface. Users can upload an existing resume or start from scratch using the platform’s guided form builder. As they input their experience, education, and skills, GPT-4o generates clean, well-structured content tailored to their target role or industry.

But CVitaePRO goes beyond writing. It simulates real-world ATS filters, parsing the resume and scoring it against actual job descriptions to detect keyword gaps, formatting issues, and content mismatches. Users receive actionable feedback in real time — with clear suggestions on how to improve their ATS score and increase recruiter visibility.

Each resume is editable before export, allowing users to refine their content using a flexible, WYSIWYG editor. Cover letters can also be generated using similar inputs, ensuring consistent tone, branding, and relevance across application materials.

Security is central to the platform. CVitaePRO uses JWT-based authentication and bcrypt hashing to safeguard user data. Resumes and cover letters are stored in a PostgreSQL database, with Redis caching and API rate limiting in place to reduce cost and abuse while maintaining performance.

Whether you’re a first-time applicant or a seasoned professional tailoring documents for a career pivot, CVitaePRO delivers the tools, intelligence, and flexibility to stand out — not blend in.

In an age where AI-written resumes are the new normal, CVitaePRO ensures yours is better written, better structured, and built to be seen.

<div style="text-align: right;">
  <a href="#top">
    <img src="https://img.shields.io/badge/Back%20to%20Top-%E2%86%91-royalblue" alt="Back to Top">
  </a>
</div>

---

## 📘 About

Writing a resume shouldn’t feel like an impossible task — but for many job seekers, it is. From figuring out the right structure to choosing the right words and meeting recruiter expectations, most people struggle to present their experience in a way that’s clear, compelling, and competitive. On top of that, automated Applicant Tracking Systems (ATS) filter out poorly formatted or keyword-weak resumes before they’re ever seen by a human.

**CVitaePRO eliminates that friction.**

This platform combines the intelligence of OpenAI’s GPT-4o with an intuitive, user-friendly interface to help applicants create highly tailored, recruiter-ready resumes and cover letters — instantly. Whether you're uploading an existing resume or starting from scratch, CVitaePRO analyzes your input, rewrites it for clarity and impact, and formats it for both readability and ATS compliance.

Users receive real-time feedback on formatting, keyword coverage, and structure. The built-in ATS simulation identifies how well a resume aligns with a specific job description and provides actionable suggestions to improve the score.

With features like secure document storage, export to PDF/DOCX, guided resume-building steps, and smart customization, CVitaePRO helps users focus on what matters: landing the interview.

Whether you’re applying to your first job or your fiftieth, CVitaePRO empowers you to present your best self — clearly, confidently, and effectively.

<div style="text-align: right;">
  <a href="#top">
    <img src="https://img.shields.io/badge/Back%20to%20Top-%E2%86%91-royalblue" alt="Back to Top">
  </a>
</div>

---

## 💡 Use Case

CVitaePRO is designed for:
- Job-seekers applying to roles online
- Applicants who need a resume but don't know where to start
- Users frustrated by ATS rejections
- Professionals looking to tailor documents per job
- Recruiters and coaches helping others with applications

The platform solves:
- Resume writer’s block
- Weak keyword matching
- Formatting issues that block ATS parsing
- Impersonal or low-impact cover letters
- Manual re-editing of documents for each new job

<div style="text-align: right;">
  <a href="#top">
    <img src="https://img.shields.io/badge/Back%20to%20Top-%E2%86%91-royalblue" alt="Back to Top">
  </a>
</div>

---

## ❗ Problems It Solves

- ❌ Inconsistent resume formatting that fails to impress recruiters
- ❌ Poor keyword optimization resulting in ATS rejection
- ❌ Generic, impersonal cover letters with no job targeting
- ❌ Repetitive manual editing when applying to multiple jobs
- ❌ Lack of actionable feedback on resume effectiveness
- ❌ Difficulty translating experience into clear, professional language
- ❌ Confusing resume structures that bury important information
- ❌ No visibility into how a resume performs against a job description
- ❌ Limited design flexibility within ATS-safe templates
- ❌ High friction for non-technical users trying to format documents
- ❌ Time wasted juggling multiple tools for writing, editing, and scoring

CVitaePRO addresses all of the above by combining intelligent AI-driven content generation, ATS simulation, user-friendly UI, and streamlined document management — all in one secure platform.

<div style="text-align: right;">
  <a href="#top">
    <img src="https://img.shields.io/badge/Back%20to%20Top-%E2%86%91-royalblue" alt="Back to Top">
  </a>
</div>

---

## 🔑 Key Features

### AI-Powered Resume & Cover Letter Generation
- Users input work experience, skills, and goals
- OpenAI generates structured, professional resumes
- Cover letters are aligned to job descriptions
- Documents are editable before saving/exporting

### ATS Compatibility Testing & Optimization
- Simulated ATS parses each resume for structure, clarity, and formatting
- Keyword match scoring based on job descriptions
- Real-time suggestions for boosting ATS pass rates

### Resume Builder Wizard
- Step-by-step form for resume data entry
- Autosave with localStorage to prevent data loss
- Dynamic form sections: Work Experience, Education, Skills, Certifications

### Enhanced Cover Letter Personalization
- Inputs for company name, position title, tone, and goals
- Real-time editing before download
- Options to regenerate based on feedback

### Real-Time Feedback Panel
- Live scoring for ATS match, keyword use, formatting
- Suggestions for improvements before download
- Editable before final export

### Secure Storage & Authentication
- JWT-secured login
- Password hashing via bcrypt
- Users can store and manage multiple resumes securely

### Export Tools
- Download resumes as PDF or DOCX
- OpenAI-enhanced markdown is converted and rendered for download
- Compatibility with recruiter systems and LinkedIn

<div style="text-align: right;">
  <a href="#top">
    <img src="https://img.shields.io/badge/Back%20to%20Top-%E2%86%91-royalblue" alt="Back to Top">
  </a>
</div>

---

## 🧠 ATS Algorithm Overview

CVitaePRO’s ATS scoring logic works in three phases:

**1. Resume Parsing**
```
import cheerio from 'cheerio';

function parseResume(htmlResume: string) {
  const $ = cheerio.load(htmlResume);
  return {
    name: $('h1').text(),
    email: $('a[href^="mailto:"]').text(),
    phone: $('a[href^="tel:"]').text(),
    experience: $('section#experience').text(),
    education: $('section#education').text(),
    skills: $('section#skills').text()
  };
}
```

**2. Keyword Matching**
```
function matchKeywords(resumeText: string, jobDescription: string): number {
  const jobKeywords = jobDescription.toLowerCase().match(/\b\w+\b/g) || [];
  const resumeWords = resumeText.toLowerCase().match(/\b\w+\b/g) || [];

  let matches = jobKeywords.filter(word => resumeWords.includes(word)).length;
  return (matches / jobKeywords.length) * 100;
}
```

**3. ATS Score Calculation**
```
function calculateATSScore(keywordMatch: number, formattingErrors: string[]): number {
  let score = keywordMatch * 0.90;
  score -= formattingErrors.length * 5;
  return Math.max(0, Math.min(score, 100));
}
```

<div style="text-align: right;">
  <a href="#top">
    <img src="https://img.shields.io/badge/Back%20to%20Top-%E2%86%91-royalblue" alt="Back to Top">
  </a>
</div>

---

## 🧰 Technologies Used

**Frontend**

[![My Skills](https://skillicons.dev/icons?i=react,vite,ts,html,tailwindcss,css&perline=3)](https://skillicons.dev)

[![OpenAI](https://img.shields.io/badge/OpenAI-74aa9c?style=for-the-badge&logo=openai&logoColor=white)](https://openai.com)

**Backend**

[![My Skills](https://skillicons.dev/icons?i=nodejs,expressjs,postgres,redis,postman,sequelize,npm,regex,ts&perline=3)](https://skillicons.dev)

&nbsp; [![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=json-web-tokens)](https://jwt.io/)
&nbsp; [![Bcrypt](https://img.shields.io/badge/Bcrypt-000000?style=for-the-badge&logo=javascript)](https://www.npmjs.com/package/bcrypt)
&nbsp; [![cheerio](https://img.shields.io/badge/cheerio-000000?style=for-the-badge&logo=javascript)](https://cheerio.js.org/)

&nbsp; [![PDFKit](https://img.shields.io/badge/PDFKit-000000?style=for-the-badge&logo=javascript)](http://pdfkit.org/)
&nbsp; [![pdf-parse](https://img.shields.io/badge/pdf--parse-000000?style=for-the-badge&logo=javascript)](https://www.npmjs.com/package/pdf-parse)
&nbsp; [![mammoth](https://img.shields.io/badge/mammoth-000000?style=for-the-badge&logo=javascript)](https://www.npmjs.com/package/mammoth)

&nbsp; [![natural](https://img.shields.io/badge/natural-000000?style=for-the-badge&logo=javascript)](https://www.npmjs.com/package/natural)
&nbsp; [![node-html-parser](https://img.shields.io/badge/node--html--parser-000000?style=for-the-badge&logo=javascript)](https://www.npmjs.com/package/node-html-parser)



**Testing**

[![My Skills](https://skillicons.dev/icons?i=cypress,electron,&perline=3)](https://skillicons.dev)

**Other Technologies**

[![My Skills](https://skillicons.dev/icons?i=github,bash,figma,&perline=3)](https://skillicons.dev)

<div style="text-align: right;">
  <a href="#top">
    <img src="https://img.shields.io/badge/Back%20to%20Top-%E2%86%91-royalblue" alt="Back to Top">
  </a>
</div>

---

## 📚 Supplemental Docs

[License](docs/LICENSE.md) — Legal terms and conditions for using this project

[Business Proposal](docs/BusinessProposal.md) — Detailed business plan and feature breakdown

[Client README](docs/CLIENT_README.md) — Frontend-specific instructions and notes

[API Reference](docs/API_REFERENCE.md) — API route structure, examples, and usage

[ATS Scoring](docs/ATS_SCORING.md) — Breakdown of the ATS scoring system

[Resume Structure](docs/RESUME_STRUCTURE.md) — Resume schema used throughout the app

[Contributing](docs/CONTRIBUTING.md) — Contribution guidelines and commit message format

<div style="text-align: right;">
  <a href="#top">
    <img src="https://img.shields.io/badge/Back%20to%20Top-%E2%86%91-royalblue" alt="Back to Top">
  </a>
</div>

---

## 🗺 Future Enhancements

- Multi-language support for resumes and cover letters
- Resume performance tracking analytics
- LinkedIn integration for syncing and updates
- Premium resume templates and themes
- Recruiter feedback loop + A/B testing
- Export-to-portfolio and public resume sharing options
- Mobile app for on-the-go resume building
- AI-driven interview preparation tools
- Integration with job boards for one-click applications
- Enhanced collaboration tools for recruiters and career coaches
- Gamified resume building experience
- Accessibility improvements for visually impaired users
- Automated follow-up email generation after applications
- Integration with calendar apps for interview scheduling
- Customizable resume sections based on industry
- AI-driven suggestions for career growth based on resume analysis
- Enhanced security features like two-factor authentication
- Resume versioning and change tracking
- Support for additional file formats (e.g., LaTeX)
- Automated job application tracking and reminders
- Integration with HRIS systems for easy resume submission
- Customizable notifications for job application updates
- Enhanced analytics dashboard for resume performance
- Support for video resumes and multimedia elements
- AI-driven suggestions for improving resume language and tone

<div style="text-align: right;">
  <a href="#top">
    <img src="https://img.shields.io/badge/Back%20to%20Top-%E2%86%91-royalblue" alt="Back to Top">
  </a>
</div>

---

## 🎯 Conclusion

CVitaePRO is redefining how people write resumes. With intelligent automation, recruiter-focused formatting, and ATS testing built-in, job seekers can apply smarter and faster. Whether you’re just getting started or updating your resume for a specific role, CVitaePRO gives you the tools to stand out, backed by AI.

<div style="text-align: right;">
  <a href="#top">
    <img src="https://img.shields.io/badge/Back%20to%20Top-%E2%86%91-royalblue" alt="Back to Top">
  </a>
</div>

