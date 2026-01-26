function isOwnedKeyByUser(key, userId) {
  if (typeof key !== "string") return false;

  // ✅ only user-private files are owner-bound
  return key.startsWith(`users/${userId}/`);
}

function isUsersKey(key) {
  return typeof key === "string" && key.startsWith("users/");
}

function isPostsKey(key) {
  return typeof key === "string" && key.startsWith("posts/");
}

// ✅ NEW: public reads for posts (anyone can view)
function isPublicReadKey(key) {
  return isPostsKey(key);
}

module.exports = { isOwnedKeyByUser, isUsersKey, isPostsKey, isPublicReadKey };
