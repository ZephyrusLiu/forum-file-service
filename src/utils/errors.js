function httpError(status, code, message) {
  const err = new Error(message);
  err.status = status;
  err.code = code || "ERROR";
  return err;
}

module.exports = { httpError };
