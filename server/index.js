const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/api/test", (req, res) => {
  res.json({ message: "Hello from Express 🚀" });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
