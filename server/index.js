import express from "express";
import summariserRoutes from "./routes/summariser.js";

const app = express();
const PORT = 3000;

app.use(express.json());

// mount routes under /api
app.use("/api", summariserRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

