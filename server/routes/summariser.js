import express from "express";
import {
  generateSummary,
  generateLessTechnicalSummary,
} from "../services/summariserService.js";

const router = express.Router();

router.post("/summarise", async (req, res) => {
  const { text } = req.body;

  if (!text) return res.status(400).json({ error: "Missing text" });

  try {
    const result = await generateSummary(text);

    res.json(result);
  } catch (err) {
    console.error("Error in /summarise route:", err);
    res.status(500).json({ error: "Failed to generate summary" });
  }
});

router.post("/summarise/less-technical", async (req, res) => {
  const { text, projectSummary, keySkills } = req.body;

  if (!text || !projectSummary) {
    return res
      .status(400)
      .json({ error: "Missing text or projectSummary for simplification" });
  }

  try {
    const result = await generateLessTechnicalSummary({
      text,
      projectSummary,
      keySkills,
    });

    res.json(result);
  } catch (err) {
    console.error("Error in /summarise/less-technical route:", err);
    res.status(500).json({ error: "Failed to simplify summary" });
  }
});

export default router;
