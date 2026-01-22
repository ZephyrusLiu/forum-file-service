const crypto = require("crypto");
const { sanitizeFilename } = require("./sanitize");

function buildUserAvatarKey({ userId, filename }) {
  // If you want fixed avatar filename, use avatar.png
  // But keep original extension if you want:
  const safe = sanitizeFilename(filename || "avatar.png");
  return `users/${userId}/avatar/${crypto.randomUUID()}_${safe}`;
}

function buildUserCoverKey({ userId, filename }) {
  const safe = sanitizeFilename(filename || "cover.png");
  return `users/${userId}/cover/${crypto.randomUUID()}_${safe}`;
}

function buildPostAttachmentKey({ userId, postId, filename }) {
  const safe = sanitizeFilename(filename);
  return `posts/${userId}/post-${postId}/${crypto.randomUUID()}_${safe}`;
}

function buildPostsTmpKey({ userId, filename }) {
  const safe = sanitizeFilename(filename);
  return `posts/${userId}/tmp/${crypto.randomUUID()}_${safe}`;
}

module.exports = {
  buildUserAvatarKey,
  buildUserCoverKey,
  buildPostAttachmentKey,
  buildPostsTmpKey,
};
