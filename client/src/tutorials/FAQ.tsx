import React, { useState } from "react";
import { Info } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
  modalContent?: string;
}

const groupedFAQs: Record<string, FAQItem[]> = {
  "About CVitaePRO": [
    { question: "What is CVitaePRO?", answer: "CVitaePRO is an AI-powered resume creation and enhancement platform that helps job seekers build tailored, professional, ATS-ready resumes in minutes." },
    { question: "Is CVitaePRO really free to use?", answer: "Yes, our core features—including resume building, enhancement, and ATS scoring—are completely free during our public launch." },
    { question: "How is my resume data stored and protected?", answer: "Your data is encrypted at rest and in transit. We follow strict security protocols to keep your information private and safe." },
    { question: "Do you store or send my resume to third parties?", answer: "No. CVitaePRO does not share or sell your resume content to any third parties. Your data stays with you." },
    { question: "How many resumes can I create or enhance?", answer: "You can create unlimited resumes, but AI-enhancement is limited to 7 uses per day to prevent abuse." },
    { question: "Why do I need to create an account to access full features?", answer: "Creating an account lets us protect your data, enable enhancement history, and apply usage limits securely." },
    { question: "What is an ATS score and how does CVitaePRO calculate it?", answer: "The ATS score shows how well your resume matches job descriptions and follows recruiter-friendly formatting.", modalContent: "Our scoring model evaluates formatting, keyword relevance, soft skill density, and contact information placement to produce an ATS compliance score." },
    { question: "How does the AI enhance my resume?", answer: "Our AI rewrites your resume content to emphasize impact, add relevant keywords, and boost ATS performance.", modalContent: "Using OpenAI’s GPT-4o model, our AI rephrases your experience and skills while preserving accuracy and professionalism." },
    { question: "Can I download my resume in PDF and DOCX formats?", answer: "Yes! You can download your final resume in both formats with formatting matched to ATS-friendly templates." },
    { question: "Why is there a 2-page limit for resumes on this platform?", answer: "Recruiters prefer resumes that are concise and focused. We help you keep yours within 1–2 pages for maximum impact." },
  ],
  "Resume Best Practices": [
    { question: "What should I include in my resume summary?", answer: "Use 2–3 sentences to summarize your title, years of experience, and areas of expertise." },
    { question: "Should I include every job I’ve ever had?", answer: "No. Focus on your most recent 3 jobs or last 10–15 years of experience." },
    { question: "How far back should my work history go?", answer: "Usually 10–15 years. Anything older is often irrelevant unless it directly matches the job you're applying for." },
    { question: "What if I have gaps in my employment?", answer: "Gaps are normal. Address them briefly in your resume or cover letter and emphasize what you did in between (e.g., freelancing, upskilling)." },
    { question: "How do I know which skills to list?", answer: "Include both hard and soft skills listed in the job description and those relevant to your industry." },
    { question: "How do I tailor my resume to a specific job posting?", answer: "Mirror keywords and skills from the job description, and rewrite your summary and experiences to reflect the role’s requirements.", modalContent: "Use our AI resume enhancer to analyze your input against job listings and rewrite your resume with keyword optimization automatically." },
    { question: "What’s the best resume format for ATS (Applicant Tracking Systems)?", answer: "A clean, single-column layout with standardized headers (e.g., Work Experience, Education, Skills). Avoid graphics or tables." },
    { question: "Should I use graphics, colors, or custom fonts?", answer: "Keep it simple. Fancy designs often break in ATS software. Stick to readable fonts and minimal color use." },
    { question: "What’s the difference between a resume and a CV?", answer: "A resume is a 1–2 page summary of your experience. A CV is a full academic or career history, typically used in academia or international jobs." },
    { question: "Can I use the same resume for every job?", answer: "You can, but customizing it to the job will greatly improve your chances of landing interviews." },
  ]
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
    </div>
  );
};

export default FaQ;
