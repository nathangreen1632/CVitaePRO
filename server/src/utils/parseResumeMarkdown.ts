// export const parseResumeMarkdown = (markdown: string): object => {
//   const sections = markdown.split("\n\n"); // Split by double newlines
//
//   const resume: any = {
//     resume_summary: "",
//     experience: [],
//     education: [],
//     skills: [],
//   };
//
//   sections.forEach(section => {
//     if (section.startsWith("**Resume Summary:**")) {
//       resume.resume_summary = section.replace("**Resume Summary:**", "").trim();
//     } else if (section.startsWith("**Experience:**")) {
//       const experiences = section.split("\n").slice(1); // Skip the heading
//       experiences.forEach(exp => {
//         const match = RegExp(/\*\*(.*?)\*\* at (.*?) \((.*?) - (.*?)\)\s+Responsibilities: (.*)/).exec(exp);
//         if (match) {
//           resume.experience.push({
//             role: match[1],
//             company: match[2],
//             start_date: match[3],
//             end_date: match[4],
//             responsibilities: match[5].split(", "),
//           });
//         }
//       });
//     } else if (section.startsWith("**Education:**")) {
//       const educations = section.split("\n").slice(1);
//       educations.forEach(edu => {
//         const match = RegExp(/\*\*(.*?)\*\* from (.*?) \((.*?)\)/).exec(edu);
//         if (match) {
//           resume.education.push({
//             degree: match[1],
//             institution: match[2],
//             graduation_year: match[3],
//           });
//         }
//       });
//     } else if (section.startsWith("**Skills:**")) {
//       resume.skills = section.replace("**Skills:**", "").trim().split(", ");
//     }
//   });
//
//   return resume;
// };
