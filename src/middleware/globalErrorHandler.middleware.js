const globalErrorHandler = (err, req, res, next) => {
  console.error("🔥 Error:", err.stack);

  const status = err.statusCode || 500;
  const message = err.message || "Server error";

  return res.status(status).json({
    isSuccess: false,
    message,
    status,
  });
};

export default globalErrorHandler;
