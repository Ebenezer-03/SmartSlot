const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getUrgencyLevel = async (patientData) => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `
You are a hospital triage assistant. Classify the urgency as High, Medium, or Low.

Examples:
{ "age": 70, "symptoms": ["Chest pain"], "bodytemperature": 39 } → High
{ "age": 25, "symptoms": ["Cough"], "bodytemperature": 36.5 } → Low

Now classify:
${JSON.stringify(patientData)}
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text().trim();
  const urgency = text.match(/High|Medium|Low/i)?.[0] || "Unknown";

  return urgency;
};

module.exports = getUrgencyLevel;
