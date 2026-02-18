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

export async function generateLessTechnicalSummary({
  text,
  projectSummary,
  keySkills = [],
}) {
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You rewrite project summaries in clear, less technical language " +
          "for non-technical stakeholders. Always respond with ONLY valid JSON, no markdown.",
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text:
              "You are given a project description and an existing summary. " +
              "Rewrite the summary so it is less technical and easier to understand, " +
              "while preserving the key information.\n\n" +
              "Return a JSON object with the exact fields: " +
              '"projectSummary" (string, 2-4 sentences, less technical) and ' +
              '"keySkills" (array of 3-7 short skill strings, updated only if needed).\n\n' +
              `Project description:\n${text}\n\n` +
              `Existing summary:\n${projectSummary}\n\n` +
              `Existing key skills (optional):\n${Array.isArray(keySkills) ? keySkills.join(
                ", "
              ) : ""}`,
          },
        ],
      },
    ],
  });

  const rawContent = response.choices?.[0]?.message?.content;

  let newProjectSummary = projectSummary;
  let newKeySkills = keySkills ?? [];

  try {
    const parsed =
      typeof rawContent === "string"
        ? JSON.parse(rawContent)
        : JSON.parse(rawContent?.[0]?.text ?? "");

    newProjectSummary = parsed.projectSummary ?? newProjectSummary;
    newKeySkills = Array.isArray(parsed.keySkills) ? parsed.keySkills : newKeySkills;
  } catch (err) {
    // Fallback: if parsing fails, treat the raw content as a plain summary
    newProjectSummary =
      typeof rawContent === "string"
        ? rawContent
        : rawContent?.[0]?.text ?? newProjectSummary;
  }

  return {
    projectSummary: newProjectSummary,
    keySkills: newKeySkills,
    portfolioCard: newProjectSummary,
    cvBullet:
      newKeySkills && newKeySkills.length > 0
        ? `Key skills: ${newKeySkills.join(", ")}`
        : newProjectSummary,
    readmeIntro: newProjectSummary,
  };
}


export async function generateMoreImpactfulSummary({
  text,
  projectSummary,
  keySkills = [],
}) {
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You rewrite project summaries to be more impactful, compelling, and clear, " +
          "while remaining strictly honest and not inventing achievements or details. " +
          "Always respond with ONLY valid JSON, no markdown.",
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text:
              "You are given a project description and an existing summary. " +
              "Rewrite the summary so it is more impactful and compelling for a hiring manager, " +
              "while staying strictly truthful to the information given. Do not exaggerate or add facts.\n\n" +
              "Return a JSON object with the exact fields: " +
              '"projectSummary" (string, 2-4 sentences, more impactful but honest) and ' +
              '"keySkills" (array of 3-7 short skill strings, updated only if needed).\n\n' +
              `Project description:\n${text}\n\n` +
              `Existing summary:\n${projectSummary}\n\n` +
              `Existing key skills (optional):\n${Array.isArray(keySkills) ? keySkills.join(
                ", "
              ) : ""}`,
          },
        ],
      },
    ],
  });

  const rawContent = response.choices?.[0]?.message?.content;

  let newProjectSummary = projectSummary;
  let newKeySkills = keySkills ?? [];

  try {
    const parsed =
      typeof rawContent === "string"
        ? JSON.parse(rawContent)
        : JSON.parse(rawContent?.[0]?.text ?? "");

    newProjectSummary = parsed.projectSummary ?? newProjectSummary;
    newKeySkills = Array.isArray(parsed.keySkills) ? parsed.keySkills : newKeySkills;
  } catch (err) {
    // Fallback: if parsing fails, treat the raw content as a plain summary
    newProjectSummary =
      typeof rawContent === "string"
        ? rawContent
        : rawContent?.[0]?.text ?? newProjectSummary;
  }

  return {
    projectSummary: newProjectSummary,
    keySkills: newKeySkills,
    portfolioCard: newProjectSummary,
    cvBullet:
      newKeySkills && newKeySkills.length > 0
        ? `Key skills: ${newKeySkills.join(", ")}`
        : newProjectSummary,
    readmeIntro: newProjectSummary,
  };
}

export async function generateBulletSummary({ text, projectSummary, keySkills = [] }) {
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You rewrite project summaries as concise bullet points. " +
          "Always respond with ONLY valid JSON, no markdown.",
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text:
              "You are given a project description and an existing summary. " +
              "Rewrite the summary as 3-7 concise bullet points. " +
              "Return a JSON object with the exact fields: " +
              '"projectSummary" (array of bullet point strings) and ' +
              '"keySkills" (array of 3-7 short skill strings, updated only if needed).\n\n' +
              `Project description:\n${text}\n\n` +
              `Existing summary:\n${projectSummary}\n\n` +
              `Existing key skills (optional):\n${Array.isArray(keySkills) ? keySkills.join(", ") : ""}`,
          },
        ],
      },
    ],
  });

  const rawContent = response.choices?.[0]?.message?.content;

  let newProjectSummary = [];
  let newKeySkills = keySkills ?? [];

  try {
    const parsed =
      typeof rawContent === "string"
        ? JSON.parse(rawContent)
        : JSON.parse(rawContent?.[0]?.text ?? "");

    newProjectSummary = Array.isArray(parsed.projectSummary)
      ? parsed.projectSummary
      : [projectSummary];
    newKeySkills = Array.isArray(parsed.keySkills) ? parsed.keySkills : newKeySkills;
  } catch (err) {
    // fallback: put original summary in one bullet
    newProjectSummary = [projectSummary];
  }

  return {
    projectSummary: newProjectSummary,
    keySkills: newKeySkills,
    portfolioCard: newProjectSummary.join("\n"),
    cvBullet:
      newKeySkills && newKeySkills.length > 0
        ? `Key skills: ${newKeySkills.join(", ")}`
        : newProjectSummary.join("\n"),
    readmeIntro: newProjectSummary.join("\n"),
  };
}



