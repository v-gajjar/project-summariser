import express from "express";
import echoRoutes from "./routes/echo.js";

const app = express();
const PORT = 3000;

app.use(express.json());

// mount routes under /api
app.use("/api", echoRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

