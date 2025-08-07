const handelGlobalError = (err, req, res, next) => {
  return res.status(err.status || 500).json({
    isSuccess: false,
    message: err.message || "Server error",
    status: err.status || 500,
  });
};

export default handelGlobalError;
