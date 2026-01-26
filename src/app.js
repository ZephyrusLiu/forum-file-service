const express = require("express");
const auth = require("./middleware/auth.middleware");
const fileRoutes = require("./routes/files.routes"); 
const cors = require("cors");



const app = express();
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
}));

app.options("*", cors());

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

