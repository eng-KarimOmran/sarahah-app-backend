const createError = ({ message = "failed", status = 400 }) => {
  const error = new Error();
  error.message = message;
  error.status = status;
  return error;
};

export default createError;