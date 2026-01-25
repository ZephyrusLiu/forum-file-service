const { PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const { s3 } = require("../config/s3");
const { httpError } = require("../utils/errors");
const { buildUserKey, buildPostKey } = require("../utils/s3Keys");
const { isOwnedKeyByUser, isUsersKey, isPostsKey } = require("../utils/ownership");

const BUCKET = process.env.AWS_S3_BUCKET;
const GET_EXPIRES = Number(process.env.S3_GET_EXPIRES || 300);

async function uploadToS3({ userId, scope, kind, postId, filename, contentType, buffer }) {
  if (!scope) throw httpError(400, "BAD_REQUEST", "scope is required (users|posts)");
  if (!filename || !contentType) throw httpError(400, "BAD_REQUEST", "filename and contentType required");
  if (!buffer) throw httpError(400, "BAD_REQUEST", "file buffer required");

  let key;

	
  if (scope === "users") {
    if (kind !== "avatar" && kind !== "cover") throw httpError(400, "BAD_REQUEST", "kind must be avatar|cover");
    if (!String(contentType).startsWith("image/")) throw httpError(400, "BAD_REQUEST", "Only images allowed");
    key = buildUserKey({ userId, kind, filename });
  } else if (scope === "posts") {
    if (!postId) throw httpError(400, "BAD_REQUEST", "postId is required for posts scope");
    // allow images/pdf if you want
    // const ok = contentType.startsWith("image/") || contentType === "application/pdf";
    // if (!ok) throw httpError(400, "BAD_REQUEST", "Unsupported type");
    key = buildPostKey({ userId, postId, filename });
  } else {
    throw httpError(400, "BAD_REQUEST", "scope must be users or posts");
  }
  

  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  );




  const publicUrl = `https://${BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  return { key, url: publicUrl };
}

async function presignDownload({ userId, key }) {
  if (!key) throw httpError(400, "BAD_REQUEST", "key required");
  if (!isOwnedKeyByUser(key, userId)) throw httpError(403, "FORBIDDEN", "Not allowed");
  if (!isUsersKey(key) && !isPostsKey(key)) throw httpError(403, "FORBIDDEN", "Not allowed");

  const cmd = new GetObjectCommand({ Bucket: BUCKET, Key: key });
  const url = await getSignedUrl(s3, cmd, { expiresIn: GET_EXPIRES });
  return { url, expiresIn: GET_EXPIRES };
}

module.exports = { uploadToS3, presignDownload };
