const { PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const { s3 } = require("../config/s3");
const { httpError } = require("../utils/errors");
const { isOwnedUsersKey } = require("../utils/ownership");
const { buildUserAvatarKey, buildUserCoverKey } = require("../utils/s3Keys");

const BUCKET = process.env.AWS_S3_BUCKET;
const PUT_EXPIRES = Number(process.env.S3_PUT_EXPIRES || 60);
const GET_EXPIRES = Number(process.env.S3_GET_EXPIRES || 300);

// kind: "avatar" | "cover"
async function presignUserUpload({ userId, kind, filename, contentType }) {
  if (!filename || !contentType) throw httpError(400, "BAD_REQUEST", "filename and contentType required");

  if (kind !== "avatar" && kind !== "cover") {
    throw httpError(400, "BAD_REQUEST", "kind must be avatar or cover");
  }

  // Optional: enforce only images for profile
  if (!String(contentType).startsWith("image/")) {
    throw httpError(400, "BAD_REQUEST", "Only image uploads allowed for user media");
  }

  const key =
    kind === "avatar"
      ? buildUserAvatarKey({ userId, filename })
      : buildUserCoverKey({ userId, filename });

  const cmd = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(s3, cmd, { expiresIn: PUT_EXPIRES });
  return { key, uploadUrl, expiresIn: PUT_EXPIRES };
}

async function presignUserDownload({ userId, key }) {
  if (!key) throw httpError(400, "BAD_REQUEST", "key required");
  if (!isOwnedUsersKey(key, userId)) throw httpError(403, "FORBIDDEN", "Not allowed");

  const cmd = new GetObjectCommand({ Bucket: BUCKET, Key: key });
  const url = await getSignedUrl(s3, cmd, { expiresIn: GET_EXPIRES });
  return { url, expiresIn: GET_EXPIRES };
}

module.exports = { presignUserUpload, presignUserDownload };
