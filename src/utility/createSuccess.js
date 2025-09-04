const createSuccess = (res, { status = 200, message = "done", ...data }) => {
  return res.status(status).json({
    isSuccess: true,
    message,
    ...data,
    status,
  });
};

export default createSuccess;
