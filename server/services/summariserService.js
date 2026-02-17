// server/services/summariserService.js
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY in .env");
}

const client = new OpenAI({
  baseURL: "https://api.router.tetrate.ai/v1", // points to Tetrate
  apiKey: process.env.OPENAI_API_KEY, // explicitly pass your Tetrate key
});

export async function generateSummary(text) {
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a helpful project summariser. " +
          "Always respond with ONLY valid JSON, no markdown or commentary.",
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text:
              "Summarise the following project description. " +
              'Return a JSON object with the exact fields: "projectSummary" (string, 2-4 sentences) ' +
              'and "keySkills" (array of 3-7 short skill strings). ' +
              "Respond with ONLY the JSON object.\n\n" +
              `Project description:\n${text}`,
          },
        ],
      },
    ],
  });

  const rawContent = response.choices?.[0]?.message?.content;

  let projectSummary = "";
  let keySkills = [];

  try {
    const parsed =
      typeof rawContent === "string"
        ? JSON.parse(rawContent)
        : JSON.parse(rawContent?.[0]?.text ?? "");

    projectSummary = parsed.projectSummary ?? "";
    keySkills = Array.isArray(parsed.keySkills) ? parsed.keySkills : [];
  } catch (err) {
    // Fallback: if parsing fails, treat the raw content as a plain summary
    projectSummary =
      typeof rawContent === "string"
        ? rawContent
        : rawContent?.[0]?.text ?? "";
    keySkills = [];
  }

  return {
    // New structured fields
    projectSummary,
    keySkills,

    // Backwards-compatible fields for the existing UI
    portfolioCard: projectSummary,
    cvBullet:
      keySkills.length > 0
        ? `Key skills: ${keySkills.join(", ")}`
        : projectSummary,
    readmeIntro: projectSummary,
  };
}
