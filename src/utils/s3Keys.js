const crypto = require("crypto");
const { sanitizeFilename } = require("./sanitize");

// USERS
function buildUserKey({ userId, kind, filename }) {
  // kind: "avatar" | "cover"
  const safe = sanitizeFilename(filename || `${kind}.png`);
  return `users/${userId}/${kind}/${crypto.randomUUID()}_${safe}`;
}

// POSTS
function buildPostKey({ userId, postId, filename }) {
  const safe = sanitizeFilename(filename);
  return `posts/${userId}/post-${postId}/${crypto.randomUUID()}_${safe}`;
}

// Optional: upload before post exists
function buildPostTmpKey({ userId, filename }) {
  const safe = sanitizeFilename(filename);
  return `posts/${userId}/tmp/${crypto.randomUUID()}_${safe}`;
}

module.exports = { buildUserKey, buildPostKey, buildPostTmpKey };
