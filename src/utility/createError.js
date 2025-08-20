const createError = ({ message = "failed", statusCode = 400 }) => {
  const error = new Error();
  error.message = message;
  error.statusCode = statusCode;
  return error;
};

export default createError;