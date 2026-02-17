import express from "express";

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Existing test route
app.get("/api/test", (req, res) => {
  res.json({ message: "Hello from Express 🚀" });
});

// Echo route
app.post("/api/echo", (req, res) => {
  const { text } = req.body;

  if (!text) return res.status(400).json({ error: "Missing text" });

  res.json({ echo: `Server received: "${text}"` });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
