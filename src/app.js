const express = require("express");
<<<<<<< HEAD
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
=======
const auth = require("./middleware/auth.middleware");
const filesRoutes = require("./routes/files.routes"); // ✅ import

const app = express();
app.use(express.json());

// Health check
app.get("/health", (_req, res) => res.json({ ok: true }));

// Protect all file endpoints
app.use("/files", auth);
app.use("/files", filesRoutes);
>>>>>>> SCRUM-59-D5-AR-1-File-service-S3-upload-implementation-returns-URL-NO-DB

module.exports = app;
