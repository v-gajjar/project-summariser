import express from "express";

const router = express.Router();

router.post("/echo", (req, res) => {
  const { text } = req.body;

  if (!text) return res.status(400).json({ error: "Missing text" });

  res.json({ echo: `Server received the following input: "${text}"` });
});

export default router;
