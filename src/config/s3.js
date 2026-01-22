const { S3Client } = require("@aws-sdk/client-s3");

function createS3Client() {
  const region = process.env.AWS_REGION;

  // If keys are present, use them (local dev). Otherwise, rely on IAM role (prod).
  const hasKeys = !!process.env.AWS_ACCESS_KEY_ID && !!process.env.AWS_SECRET_ACCESS_KEY;

  return new S3Client({
    region,
    credentials: hasKeys
      ? {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        }
      : undefined,
  });
}

const s3 = createS3Client();

module.exports = { s3 };
