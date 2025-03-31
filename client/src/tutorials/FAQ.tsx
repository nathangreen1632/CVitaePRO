import React, { useState } from "react";
import { Info } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
  modalContent?: string;
}

const groupedFAQs: Record<string, FAQItem[]> = {
  "About CVitaePRO": [
    { question: "What is CVitaePRO?", answer: "CVitaePRO is an AI-powered resume creation and enhancement platform that helps job seekers build tailored, professional, ATS-ready resumes in minutes.", modalContent: "CVitaePRO uses advanced AI algorithms to analyze job descriptions and optimize your resume for ATS systems, ensuring you stand out to recruiters." },
    { question: "Is CVitaePRO really free to use?", answer: "Yes, our core features—including resume building, enhancement, and ATS scoring—are completely free during our public launch.", modalContent: "CVitaePRO is a free, open-source platform that is built on top of the OpenAI API. We are not affiliated with OpenAI in any way." },
    { question: "How is my resume data stored and protected?", answer: "Your data is encrypted at rest and in transit. We follow strict security protocols to keep your information private and safe.", modalContent: "CVitaePRO uses industry-standard encryption protocols to protect all personal and resume-related information during transmission and storage. Your password is securely hashed using bcrypt, and we never store plain-text credentials. Authentication is handled via secure JWT tokens, which expire after a set period to ensure session safety." },
    { question: "Do you store or send my resume to third parties?", answer: "No. CVitaePRO does not share or sell your resume content to any third parties. Your data stays with you.", modalContent: "CVitaePRO does not share or sell your resume content to any third parties. Your data stays with you." },
    { question: "How many resumes can I create or enhance?", answer: "You can create unlimited resumes, but AI-enhancement is limited to 7 uses per day to prevent abuse." },
    { question: "How do I create an account and is it safe?", answer: "Creating an account with CVitaePRO is quick, secure, and completely free. Just visit the Register page, fill in your username and password, and you're ready to get started!", modalContent: "CVitaePRO takes your data security seriously. We use industry-standard encryption protocols to protect all personal and resume-related information during transmission and storage. Your password is securely hashed using bcrypt, and we never store plain-text credentials. Authentication is handled via secure JWT tokens, which expire after a set period to ensure session safety."},
    { question: "Why do I need to create an account to access full features?", answer: "Creating an account lets us protect your data, enable enhancement history, and apply usage limits securely.", modalContent: "Creating an account allows us to protect your data, enable enhancement history, and apply usage limits securely. It also helps us provide a personalized experience tailored to your needs." },
    { question: "What is an ATS score and how does CVitaePRO calculate it?", answer: "The ATS score shows how well your resume matches job descriptions and follows recruiter-friendly formatting.", modalContent: "Our scoring model evaluates formatting, keyword relevance, soft skill density, and contact information placement to produce an ATS compliance score." },
    { question: "How does the AI enhance my resume?", answer: "Our AI rewrites your resume content to emphasize impact, add relevant keywords, and boost ATS performance.", modalContent: "Using OpenAI’s GPT-4o model, our AI rephrases your experience and skills while preserving accuracy and professionalism." },
    { question: "Can I download my resume in PDF and DOCX formats?", answer: "Yes! You can download your final resume in both formats with formatting matched to ATS-friendly templates." },
    { question: "Why is there a 2-page recommendation for resumes on this platform?", answer: "Recruiters prefer resumes that are concise and focused. We help you keep yours within 1–2 pages for maximum impact." },
    { question: "How do I contact support for issues or feedback?", answer: "You can reach our support team via the Contact Us page on our website. We’re here to help!" },
    { question: "Can I use CVitaePRO on mobile devices?", answer: "Yes! Our platform is fully responsive and works well on both desktop and mobile devices." },
    { question: "What if I have more questions?", answer: "Feel free to reach out through our Contact Us page or check our Help Center for more FAQs." },
  ],
  "Resume Best Practices": [
    { question: "What should I include in my resume summary?", answer: "Use 2–3 sentences to summarize your title, years of experience, and areas of expertise.", modalContent: "Your resume summary should be a brief overview of your professional background, highlighting your key skills and experiences that are relevant to the job you're applying for." },
    { question: "Should I include every job I’ve ever had?", answer: "No. Focus on your most recent 3 jobs or last 5-7 years of experience.", modalContent: "Include only relevant work experience that aligns with the job you're applying for. This helps keep your resume concise and focused." },
    { question: "How far back should my work history go?", answer: "Generally, 5-7 years. Anything older is often irrelevant unless it directly matches the job you're applying for. (However, this can be employer-specific)", modalContent: "For professional roles, 5-7 years is standard. For entry-level positions, include internships or relevant coursework." },
    { question: "What if I have gaps in my employment?", answer: "Address them briefly in your resume or cover letter and emphasize what you did in between (e.g., freelancing, upskilling).", modalContent: "Gaps are common. Focus on skills gained during that time, like volunteering or freelancing." },
    { question: "How do I know which skills to list?", answer: "Include both hard and soft skills listed in the job description and those relevant to your industry." },
    { question: "How do I tailor my resume to a specific job posting?", answer: "Mirror keywords and skills from the job description, and rewrite your summary and experiences to reflect the role’s requirements.", modalContent: "Use our AI resume enhancer to analyze your input against job listings and rewrite your resume with keyword optimization automatically." },
    { question: "What’s the best resume format for ATS (Applicant Tracking Systems)?", answer: "A clean, single-column layout with standardized headers (e.g., Work Experience, Education, Skills). Avoid graphics or tables." },
    { question: "Should I use graphics, colors, or custom fonts?", answer: "Keep it simple. Fancy designs often break in ATS software. Stick to readable fonts and minimal color use." },
    { question: "What’s the difference between a resume and a CV?", answer: "A resume is a 1–2 page summary of your experience. A CV is a full academic or career history, typically used in academia or international jobs.", modalContent: "A resume is a concise summary of your skills and experience, while a CV (Curriculum Vitae) is a detailed document that includes your entire academic and professional history." },
    { question: "Can I use the same resume for every job?", answer: "You can, but customizing it to the job will greatly improve your chances of landing interviews." },
    { question: "How do I list my education on my resume?", answer: "Include your degree, major, university name, and graduation date. You can also add relevant coursework or honors." },
    { question: "What’s the best way to format my work experience?", answer: "Use bullet points to list your achievements and responsibilities. Start each point with an action verb." },
    { question: "How do I quantify my achievements?", answer: "Use numbers, percentages, or specific outcomes to show your impact (e.g., 'Increased sales by 20%').", modalContent: "Quantifying your achievements makes them more impactful. Use metrics like percentages, dollar amounts, or specific outcomes to demonstrate your contributions." },
    { question: "Should I include references on my resume?", answer: "No. List them separately and state 'References available upon request'." },
  ],
  "Cover Letter Tips": [
    { question: "What should I include in my cover letter?", answer: "Start with a strong opening, explain why you’re a good fit, and end with a call to action.", modalContent: "Your cover letter should include an introduction, a brief overview of your qualifications, and a closing statement that encourages the reader to contact you." },
    { question: "How long should my cover letter be?", answer: "1 page is ideal. Keep it concise and focused.", modalContent: "A cover letter should be no longer than one page. Aim for 3-4 paragraphs that clearly convey your interest and qualifications." },
    { question: "Should I customize my cover letter for each job?", answer: "Yes! Tailor it to the job description and company culture." },
    { question: "What tone should I use in my cover letter?", answer: "Professional but friendly. Show enthusiasm for the role." },
    { question: "How do I address my cover letter?", answer: "Use the hiring manager's name if possible. If not, 'Dear Hiring Manager' is acceptable." },
    { question: "Should I include my salary expectations in my cover letter?", answer: "Only if the job posting asks for it. Otherwise, wait until later in the interview process." },
    { question: "How do I follow up after sending my cover letter?", answer: "Wait about a week, then send a polite email expressing your continued interest." },
    { question: "Can I use bullet points in my cover letter?", answer: "Yes, but use them sparingly. A few key points can help highlight your qualifications." },
    { question: "Should I mention my weaknesses in my cover letter?", answer: "Focus on your strengths and how they relate to the job. Avoid mentioning weaknesses." },
    { question: "How do I end my cover letter?", answer: "Thank the reader for their time and express your eagerness to discuss further." },
  ],
  "Job Search Strategies": [
    { question: "How do I find job openings?", answer: "Use job boards, company websites, and networking platforms like LinkedIn." },
    { question: "Should I apply for jobs I’m not fully qualified for?", answer: "Yes, if you meet most of the requirements. Tailor your resume to highlight relevant skills.", modalContent: "Our AI resume enhancer can analyze your resume and highlight relevant skills automatically." },
    { question: "How do I network effectively?", answer: "Attend industry events, join online forums, and connect with professionals on LinkedIn.", modalContent: "Networking is about building relationships. Attend industry events, join online forums, and connect with professionals on LinkedIn to expand your network." },
    { question: "What’s the best way to prepare for an interview?", answer: "Research the company, practice common interview questions, and prepare questions to ask the interviewer.", modalContent: "Preparation is key. Research the company, practice common interview questions, and prepare thoughtful questions to ask the interviewer." },
    { question: "How do I follow up after an interview?", answer: "Send a thank-you email within 24 hours, expressing your appreciation and reiterating your interest." },
    { question: "What should I do if I don’t hear back after applying?", answer: "Wait about a week, then send a polite follow-up email to check on your application status." },
    { question: "How do I negotiate my salary?", answer: "Research industry standards, know your worth, and be prepared to discuss your qualifications.", modalContent: "Negotiating your salary can be daunting, but it's important to know your worth. Research industry standards, understand your value, and be prepared to discuss your qualifications confidently." },
    { question: "What should I do if I get rejected?", answer: "Ask for feedback if possible, learn from the experience, and keep applying." },
  ],
  "Interview Preparation": [
    { question: "What are common interview questions?", answer: "Tell me about yourself, What are your strengths and weaknesses?, Why do you want to work here?, etc." },
    { question: "How do I prepare for behavioral interview questions?", answer: "Use the STAR method (Situation, Task, Action, Result) to structure your answers.", modalContent: "The STAR method is a common interview question structure that helps you focus on the most important aspects of the interview." },
    { question: "What should I wear to an interview?", answer: "Dress professionally according to the company culture. When in doubt, opt for business formal." },
    { question: "How do I handle difficult interview questions?", answer: "Stay calm, take a moment to think, and respond honestly. It’s okay to admit if you don’t know something.", modalContent: "Difficult questions are common in interviews. Stay calm, take a moment to think, and respond honestly. It's okay to admit if you don't know something." },
    { question: "How do I ask questions during an interview?", answer: "Prepare a list of thoughtful questions about the role and company culture to ask at the end." },
    { question: "What should I bring to an interview?", answer: "Extra copies of your resume, a notepad, and a pen. Optionally, a portfolio or work samples." },
    { question: "How do I follow up after an interview?", answer: "Send a thank-you email within 24 hours, expressing your appreciation and reiterating your interest." },
  ],
  "Post-Interview": [
    { question: "How do I follow up after an interview?", answer: "Send a thank-you email within 24 hours, expressing your appreciation and reiterating your interest." },
    { question: "What should I do if I don’t hear back after an interview?", answer: "Wait about a week, then send a polite follow-up email to check on your application status." },
    { question: "How do I handle job offers?", answer: "Review the offer carefully, consider your options, and negotiate if necessary." },
    { question: "What should I do if I get rejected?", answer: "Ask for feedback if possible, learn from the experience, and keep applying." },
  ],
};

const FaQ: React.FC = () => {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [modal, setModal] = useState<{ question: string; content: string } | null>(null);

  const toggle = (question: string) => {
    setExpanded(prev => (prev === question ? null : question));
  };

  const formatTextWithRedPRO = (text: string) => {
    const parts = text.split("CVitaePRO");
    return (
      <>
        {parts[0]}
        CVitae<span className="text-red-500">PRO</span>
        {parts[1]}
      </>
    );
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-2xl p-8">
        <h1 className="text-4xl font-bold text-white dark:text-white mb-10 text-center">
          Frequently Asked Questions
        </h1>

        {Object.entries(groupedFAQs).map(([category, faqs]) => (
          <div key={category} className="mb-12">
            <h2 className="text-2xl font-semibold text-white dark:text-neutral-100 mb-4 border-b border-neutral-300 dark:border-gray-900 pb-2">
              {category.includes("CVitaePRO") ? formatTextWithRedPRO(category) : category}
            </h2>

            {faqs.map(({ question, answer, modalContent }) => (
              <div key={question} className="mb-4">
                <button
                  onClick={() => toggle(question)}
                  className="flex justify-between items-center w-full text-left text-neutral-900 dark:text-neutral-100 font-medium bg-neutral-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-neutral-800 p-4 rounded-lg shadow-sm"
                >
                  <span>{question.includes("CVitaePRO") ? formatTextWithRedPRO(question) : question}</span>
                  <span className="text-xl">{expanded === question ? "−" : "+"}</span>
                </button>

                {expanded === question && (
                  <div className="bg-gray-50 dark:bg-neutral-900 border-l-4 border-red-700 dark:border-red-500 p-4 text-sm text-neutral-800 dark:text-neutral-100 mt-2 rounded-md">
                    <div className="flex justify-between items-start">
                      <p>{answer.includes("CVitaePRO") ? formatTextWithRedPRO(answer) : answer}</p>
                      {modalContent && (
                        <Info
                          className="w-5 h-5 cursor-pointer text-red-700 dark:text-red-500"
                          onClick={() => setModal({ question, content: modalContent })}
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}

        {modal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl max-w-md w-full shadow-2xl">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
                More Info: {modal.question.includes("CVitaePRO")
                ? formatTextWithRedPRO(modal.question)
                : modal.question}
              </h2>
              <p className="text-sm text-neutral-800 dark:text-neutral-100">
                {modal.content.includes("CVitaePRO")
                  ? formatTextWithRedPRO(modal.content)
                  : modal.content}
              </p>
              <button
                onClick={() => setModal(null)}
                className="mt-6 w-full bg-red-700 text-white py-2 rounded-lg hover:bg-red-800 transition"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
      {/* 🔴 Floating Back to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 z-50 bg-red-500 text-white px-4 py-2 rounded-full shadow-md hover:bg-red-700 transition"
        aria-label="Back to top"
      >
        ↑ Top
      </button>

    </div>
  );
};

export default FaQ;
