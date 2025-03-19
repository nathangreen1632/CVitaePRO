export function convertResumeToHTML(resume: {
  name: string;
  email: string;
  phone: string;
  summary: string;
  experience: { company: string; role: string; start_date: string; end_date: string; responsibilities: string[] }[];
  education: { institution: string; degree: string; graduation_year: string }[];
  skills: string[];
  certifications: { name: string; year: string }[];
}): string {
  const experienceHTML = resume.experience
    .map(
      (exp) => `
        <div>
          <strong>${exp.role}</strong> at <em>${exp.company}</em><br/>
          <span>${exp.start_date} - ${exp.end_date}</span><br/>
          <ul>${exp.responsibilities.map((r) => `<li>${r}</li>`).join("")}</ul>
        </div>`
    )
    .join("");

  const educationHTML = resume.education
    .map(
      (edu) => `
        <div>
          <strong>${edu.degree}</strong> at <em>${edu.institution}</em><br/>
          <span>Graduated: ${edu.graduation_year}</span>
        </div>`
    )
    .join("");

  const skillsHTML = resume.skills.map((skill) => `<li>${skill}</li>`).join("");
  const certificationsHTML = resume.certifications
    .map((cert) => `<li>${cert.name} (${cert.year})</li>`)
    .join("");

  return `
    <section id="contact">
      <h1>${resume.name}</h1>
      <p>Email: ${resume.email}</p>
      <p>Phone: ${resume.phone}</p>
    </section>

    <section id="summary">
      <h2>Summary</h2>
      <p>${resume.summary?.replace(/```.*?```/gs, "").trim() || "No summary provided."}</p>
    </section>

    <section id="experience">
      <h2>Experience</h2>
      ${experienceHTML}
    </section>

    <section id="education">
      <h2>Education</h2>
      ${educationHTML}
    </section>

    <section id="skills">
      <h2>Skills</h2>
      <ul>${skillsHTML}</ul>
    </section>

    <section id="certifications">
      <h2>Certifications</h2>
      <ul>${certificationsHTML}</ul>
    </section>
  `;
}
