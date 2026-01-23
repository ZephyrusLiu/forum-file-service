const { PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const { s3 } = require("../config/s3");
const { httpError } = require("../utils/errors");
const { buildUserKey, buildPostKey, buildPostTmpKey } = require("../utils/s3Keys");
const { isOwnedKeyByUser, isUsersKey, isPostsKey } = require("../utils/ownership");

const BUCKET = process.env.AWS_S3_BUCKET;
const PUT_EXPIRES = Number(process.env.S3_PUT_EXPIRES || 60);
const GET_EXPIRES = Number(process.env.S3_GET_EXPIRES || 300);

async function presignUpload({ userId, scope, kind, postId, filename, contentType }) {
  if (!scope) throw httpError(400, "BAD_REQUEST", "scope is required (users|posts)");
  if (!filename || !contentType) throw httpError(400, "BAD_REQUEST", "filename and contentType required");

  let key;

  if (scope === "users") {
    // Require kind for users
    if (kind !== "avatar" && kind !== "cover") {
      throw httpError(400, "BAD_REQUEST", "kind must be avatar or cover for users scope");
    }
    // Optional: enforce images for user media
    if (!String(contentType).startsWith("image/")) {
      throw httpError(400, "BAD_REQUEST", "Only image uploads allowed for user media");
    }
    key = buildUserKey({ userId, kind, filename });
  } else if (scope === "posts") {
    // postId optional: if not present -> tmp
    key = postId
      ? buildPostKey({ userId, postId, filename })
      : buildPostTmpKey({ userId, filename });

    // Optional: restrict post attachments if you want
    // const ok = String(contentType).startsWith("image/") || contentType === "application/pdf";
    // if (!ok) throw httpError(400, "BAD_REQUEST", "Unsupported post attachment type");
  } else {
    throw httpError(400, "BAD_REQUEST", "scope must be users or posts");
  }

  const putCmd = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(s3, putCmd, { expiresIn: PUT_EXPIRES });
  return { key, uploadUrl, expiresIn: PUT_EXPIRES };
}

async function presignDownload({ userId, key }) {
  if (!key) throw httpError(400, "BAD_REQUEST", "key required");
  if (!isOwnedKeyByUser(key, userId)) throw httpError(403, "FORBIDDEN", "Not allowed");

  // Optional extra safety: must be either users/ or posts/
  if (!isUsersKey(key) && !isPostsKey(key)) throw httpError(403, "FORBIDDEN", "Not allowed");

  const getCmd = new GetObjectCommand({ Bucket: BUCKET, Key: key });
  const url = await getSignedUrl(s3, getCmd, { expiresIn: GET_EXPIRES });
  return { url, expiresIn: GET_EXPIRES };
}

module.exports = { presignUpload, presignDownload };
