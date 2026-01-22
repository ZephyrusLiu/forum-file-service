const { PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const { s3 } = require("../config/s3");
const { httpError } = require("../utils/errors");
const { isOwnedPostsKey } = require("../utils/ownership");
const { buildPostAttachmentKey, buildPostsTmpKey } = require("../utils/s3Keys");

const BUCKET = process.env.AWS_S3_BUCKET;
const PUT_EXPIRES = Number(process.env.S3_PUT_EXPIRES || 60);
const GET_EXPIRES = Number(process.env.S3_GET_EXPIRES || 300);

async function presignPostUpload({ userId, postId, filename, contentType }) {
  if (!filename || !contentType) throw httpError(400, "BAD_REQUEST", "filename and contentType required");

  // Optional: enforce allowed types for post attachments
  // const ok = String(contentType).startsWith("image/") || contentType === "application/pdf";
  // if (!ok) throw httpError(400, "BAD_REQUEST", "Unsupported file type");

  // If postId exists, store under post folder, otherwise tmp
  const key = postId
    ? buildPostAttachmentKey({ userId, postId, filename })
    : buildPostsTmpKey({ userId, filename });

  const cmd = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(s3, cmd, { expiresIn: PUT_EXPIRES });
  return { key, uploadUrl, expiresIn: PUT_EXPIRES };
}

async function presignPostDownload({ userId, key }) {
  if (!key) throw httpError(400, "BAD_REQUEST", "key required");
  if (!isOwnedPostsKey(key, userId)) throw httpError(403, "FORBIDDEN", "Not allowed");

  // extra safety: ensure post-related prefix patterns
  const ok = key.includes("/post-") || key.includes("/tmp/");
  if (!ok) throw httpError(403, "FORBIDDEN", "Not allowed");

  const cmd = new GetObjectCommand({ Bucket: BUCKET, Key: key });
  const url = await getSignedUrl(s3, cmd, { expiresIn: GET_EXPIRES });
  return { url, expiresIn: GET_EXPIRES };
}

module.exports = { presignPostUpload, presignPostDownload };
