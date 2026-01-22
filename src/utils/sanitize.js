function sanitizeFilename(name = "file") {
  // Keep letters, numbers, underscore, dash, dot
  return String(name).replace(/[^\w.\-]+/g, "_");
}

module.exports = { sanitizeFilename };
