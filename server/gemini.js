// import {
//   GoogleGenerativeAI,
//   HarmCategory,
//   HarmBlockThreshold,
// } from "@google/generative-ai";

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// const model = genAI.getGenerativeModel({
//   model: "gemini-1.5-flash",
//   systemInstruction:
//     "NOVA AI (Natural Optimized Virtual Assistant) was created by Shahe Aalam...",
// });

// const generationConfig = {
//   temperature: 1,
//   topP: 0.95,
//   topK: 64,
//   maxOutputTokens: 500,
// };

// const safetySettings = [
//   { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
//   { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
//   { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
//   { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
// ];

// export async function run(prompt) {
//   const chat = model.startChat({
//     generationConfig,
//     safetySettings,
//     history: [],
//   });

//   const result = await chat.sendMessage(prompt);
//   return result.response.text();
// }


import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.warn("Warning: GEMINI_API_KEY or VITE_GEMINI_API_KEY is not set in environment variables.");
}

const genAI = new GoogleGenerativeAI(apiKey || "");

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  systemInstruction:
    "NOVA AI (Natural Optimized Virtual Assistant) was created by Shahe Aalam.",
});

export async function run(prompt) {
  const result = await model.generateContent(prompt);
  return result.response.text();
}

