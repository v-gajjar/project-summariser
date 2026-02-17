// server/services/summariserService.js
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY in .env");
}

const client = new OpenAI({
  baseURL: "https://api.router.tetrate.ai/v1", // points to Tetrate
  apiKey: process.env.OPENAI_API_KEY,       // explicitly pass your Tetrate key
});

export async function generateSummary(text) {
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are a helpful project summariser." },
      { role: "user", content: text },
    ],
  });

  const message = response.choices[0].message.content;

  console.log(message);

  return {
    portfolioCard: message,
    cvBullet: message,
    readmeIntro: message,
  };
}
