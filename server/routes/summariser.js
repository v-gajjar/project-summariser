import express from "express";
import { generateSummary } from "../services/summariserService.js";

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

export default router;
