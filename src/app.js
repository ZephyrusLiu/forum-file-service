const express = require("express");
const auth = require("./middleware/auth.middleware");
const filesRoutes = require("./routes/files.routes"); // ✅ import

const app = express();
app.use(express.json());

// Health check
app.get("/health", (_req, res) => res.json({ ok: true }));

// Protect all file endpoints
app.use("/files", auth);
app.use("/files", filesRoutes);

module.exports = app;
