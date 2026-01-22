function isOwnedUsersKey(key, userId) {
  return typeof key === "string" && key.startsWith(`users/${userId}/`);
}

function isOwnedPostsKey(key, userId) {
  return typeof key === "string" && key.startsWith(`posts/${userId}/`);
}

module.exports = { isOwnedUsersKey, isOwnedPostsKey };
