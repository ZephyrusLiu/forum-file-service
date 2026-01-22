const svc = require("../services/usersFiles.service");

exports.presignUpload = async (req, res) => {
  try {
    const userId = req.user.id;
    const { kind, filename, contentType } = req.body || {};

    const result = await svc.presignUserUpload({ userId, kind, filename, contentType });
    res.json(result);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.code || "ERROR", message: err.message });
  }
};

exports.presignDownload = async (req, res) => {
  try {
    const userId = req.user.id;
    const key = req.query.key;

    const result = await svc.presignUserDownload({ userId, key });
    res.json(result);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.code || "ERROR", message: err.message });
  }
};
