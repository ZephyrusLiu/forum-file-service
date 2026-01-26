const jwt = require("jsonwebtoken");

module.exports = function auth(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.toLowerCase().startsWith("bearer ")) {
    return res.status(401).json({ error: "Missing Bearer token" });
  }

  const token = header.split(" ", 1)[1] || header.split(" ")[1];

  try {
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decoded.sub || decoded.id || decoded.userId;
    if (!userId) {
      return res.status(401).json({ error: "Token missing sub/id" });
    }

    const role = (decoded.type || "").toLowerCase();
    const status = (decoded.status || "").toLowerCase();

    if (!["unverified", "active", "banned"].includes(status)) {
      return res.status(401).json({ error: "Invalid status claim" });
    }

    if (status === "banned") {
      return res.status(403).json({ error: "User is banned" });
    }

    req.user = {
      id: String(userId),
      role,
      status,
      verified: status !== "unverified",
      ...decoded,
    };

    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

