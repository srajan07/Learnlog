const { GoogleGenAI } = require("@google/genai");

const generateInterviewReport = async (technicalAnswers, hrAnswers) => {
  const fallbackReport = {
    overallSummary:
      "Interview completed successfully! Your answers have been recorded. (Detailed AI analysis is currently unavailable).",
    strengths: [
      "Attempted all 10 technical questions",
      "Completed all 5 HR response questions",
    ],
    weaknesses: [
      "Detailed AI qualitative analysis unavailable at this moment",
    ],
    technicalAssessment:
      "Recorded candidate responses for technical questions covering OOP, OS, DBMS, Networks, and Data Structures.",
    communicationAssessment:
      "Recorded candidate HR responses regarding career motivations, strengths, and project experience.",
    recommendedTopics: [
      "Operating Systems (Process vs Thread)",
      "DBMS Normalization & Indexing",
      "Computer Networks (TCP vs UDP)",
      "OOP 4 Core Pillars",
    ],
    finalAdvice:
      "Review your recorded answers below and continue strengthening technical fundamentals.",
    isFallback: true,
  };

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.log("No GEMINI_API_KEY set. Returning fallback local report.");
    return fallbackReport;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const techFormatted = technicalAnswers
      .map((a, i) => `Q${i + 1}: ${a.question}\nCandidate Answer: ${a.answer || "No Answer"}`)
      .join("\n\n");

    const hrFormatted = hrAnswers
      .map((a, i) => `HR Q${i + 1}: ${a.question}\nCandidate Answer: ${a.answer || "No Answer"}`)
      .join("\n\n");

    const prompt = `You are a senior technical interviewer evaluating a fresher software developer candidate.
Analyze the candidate's answers below and generate a structured JSON evaluation report.

### TECHNICAL ROUND RESPONSES:
${techFormatted}

### HR ROUND RESPONSES:
${hrFormatted}

Respond strictly with a VALID JSON object matching this structure (no extra text, no markdown formatting outside json):
{
  "overallSummary": "A 2-3 sentence overview of candidate performance.",
  "strengths": ["Strength 1", "Strength 2", "Strength 3"],
  "weaknesses": ["Area for improvement 1", "Area for improvement 2"],
  "technicalAssessment": "2-3 sentences evaluating technical depth and accuracy.",
  "communicationAssessment": "2-3 sentences evaluating clarity, confidence, and HR responses.",
  "recommendedTopics": ["Topic 1", "Topic 2", "Topic 3"],
  "finalAdvice": "One motivational encouraging sentence."
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const responseText = response.text || "";

    // Clean JSON markdown fences if present
    const cleanJson = responseText
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    const parsedReport = JSON.parse(cleanJson);
    parsedReport.isFallback = false;
    return parsedReport;
  } catch (error) {
    console.error("Gemini API call failed or quota exceeded:", error.message);
    return fallbackReport;
  }
};

module.exports = {
  generateInterviewReport,
};
