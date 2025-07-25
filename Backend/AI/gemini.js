import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("YOUR_API_KEY");

async function run() {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = "What is the urgency level of a patient with high fever and chest pain?";

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  console.log("Urgency:", text);
}

run();
