const express = require("express");
const fileRoutes = require("./routes/file.routes");

const app = express();

// health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "UP",
    service: "file-service",
    timestamp: new Date().toISOString()
  });
});

app.use(fileRoutes);

module.exports = app;
