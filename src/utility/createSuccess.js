const createSuccess = (res, { message = "Done", status = 200, ...rest } = {}) => {
  const response = {
    isSuccess: true,
    message,
    status,
    ...rest,
  };
  return res.status(status).json(response);
};

export default createSuccess;
