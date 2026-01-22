const express = require("express");
const auth = require("./middleware/auth.middleware");

const usersFilesRoutes = require("./routes/usersFiles.routes");
const postsFilesRoutes = require("./routes/postsFiles.routes");

const app = express();
app.use(express.json());

// All file endpoints require auth
app.use("/files", auth);

// Domain-specific endpoints
app.use("/files/users", usersFilesRoutes); // teammate owns usage, but safe to include
app.use("/files/posts", postsFilesRoutes); // you own usage

// Basic health
app.get("/health", (_req, res) => res.json({ ok: true }));

module.exports = app;
