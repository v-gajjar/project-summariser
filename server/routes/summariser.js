import express from "express";
import { generateSummary } from "../services/summariserService.js";

const router = express.Router();

router.post("/summarise", (req, res) => {
  const { text } = req.body;

  if (!text) return res.status(400).json({ error: "Missing text" });

  const result = generateSummary(text);

  res.json(result);
});

export default router;
