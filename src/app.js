const express = require("express");
const auth = require("./middleware/auth.middleware");
const fileRoutes = require("./routes/files.routes"); 

const app = express();
app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "UP",
    service: "file-service",
    timestamp: new Date().toISOString(),
  });
});

// Protect file endpoints
app.use("/files", auth);
app.use("/files", fileRoutes);

module.exports = app;

