import express from "express";
import {
  generateSummary,
  generateLessTechnicalSummary,
  generateMoreImpactfulSummary,
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

router.post("/summarise/more-impactful", async (req, res) => {
  const { text, projectSummary, keySkills } = req.body;

  if (!text || !projectSummary) {
    return res
      .status(400)
      .json({ error: "Missing text or projectSummary for impact rewrite" });
  }

  try {
    const result = await generateMoreImpactfulSummary({
      text,
      projectSummary,
      keySkills,
    });

    res.json(result);
  } catch (err) {
    console.error("Error in /summarise/more-impactful route:", err);
    res.status(500).json({ error: "Failed to make summary more impactful" });
  }
});

export default router;
