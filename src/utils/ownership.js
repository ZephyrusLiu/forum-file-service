function isOwnedKeyByUser(key, userId) {
  if (typeof key !== "string") return false;
  return key.startsWith(`users/${userId}/`) || key.startsWith(`posts/${userId}/`);
}

function isUsersKey(key) {
  return typeof key === "string" && key.startsWith("users/");
}

function isPostsKey(key) {
  return typeof key === "string" && key.startsWith("posts/");
}

module.exports = { isOwnedKeyByUser, isUsersKey, isPostsKey };
