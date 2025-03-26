export const loadLegalHtml = async (file: string): Promise<string> => {
  try {
    const res = await fetch(`/legal/${file}`);
    let text = await res.text();

    const bodyStart = text.indexOf("<body>");
    const bodyEnd = text.indexOf("</body>");
    if (bodyStart !== -1 && bodyEnd !== -1) {
      text = text.slice(bodyStart + 6, bodyEnd);
    }

    return text;
  } catch (err) {
    console.error(`Error loading legal document: ${file}`, err);
    return "<p>Error loading document.</p>";
  }
};
