const AWS = require("aws-sdk");
const uuid = require("uuid");

const s3 = new AWS.S3({
  accessKeyId: process.env.S3_KEY,
  secretAccessKey: process.env.S3_SECRET,
});

const ALLOWED_EXTENSIONS = new Set(["pdf", "png", "jpg", "jpeg", "gif"]);
const BUCKET_NAME = process.env.S3_BUCKET;
const S3_LOCATION = `http://${BUCKET_NAME}.s3.amazonaws.com/`;

function getUniqueFilename(filename) {
  const ext = filename.split(".").pop().toLowerCase();
  const uniqueFilename = uuid.v4().replace(/-/g, "");
  return `${uniqueFilename}.${ext}`;
}

async function uploadFileToS3(file, acl = "public-read") {
  const uniqueFilename = getUniqueFilename(file.originalname);

  const params = {
    Bucket: BUCKET_NAME,
    Key: uniqueFilename,
    Body: file.buffer,
    ACL: acl,
    ContentType: file.mimetype,
  };

  try {
    await s3.upload(params).promise();
    return { url: `${S3_LOCATION}${uniqueFilename}` };
  } catch (e) {
    return { errors: e.message };
  }
}

async function removeFileFromS3(imageUrl) {
  const key = imageUrl.split("/").pop();

  const params = {
    Bucket: BUCKET_NAME,
    Key: key,
  };

  try {
    await s3.deleteObject(params).promise();
    return true;
  } catch (e) {
    return { errors: e.message };
  }
}
