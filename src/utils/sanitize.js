function sanitizeFilename(name = "file") {
  return String(name).replace(/[^\w.\-]+/g, "_");
}

module.exports = { sanitizeFilename };
