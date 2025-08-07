import createError from "../utility/createError.js";

const handelGlobalValidation = (schema) => {
  return async (req, res, next) => {
    const data = { ...req.body, ...req.params, ...req.query };
    const { error, value } = schema
      .unknown(true)
      .validate(data, { abortEarly: false });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return next(createError({ message: errors.join(" | "), status: 400 }));
    }
    return next();
  };
};

export default handelGlobalValidation;
