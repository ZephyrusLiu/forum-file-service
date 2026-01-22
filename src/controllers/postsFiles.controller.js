const svc = require("../services/postsFiles.service");

exports.presignUpload = async (req, res) => {
  try {
    const userId = req.user.id;
    const { postId, filename, contentType } = req.body || {};

    const result = await svc.presignPostUpload({ userId, postId, filename, contentType });
    res.json(result);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.code || "ERROR", message: err.message });
  }
};

exports.presignDownload = async (req, res) => {
  try {
    const userId = req.user.id;
    const key = req.query.key;

    const result = await svc.presignPostDownload({ userId, key });
    res.json(result);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.code || "ERROR", message: err.message });
  }
};
