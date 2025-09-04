import createError from "../utility/createError.js";

const globalValidateHandler = (schema) => {
  return (req, res, next) => {
    const data = {
      ...req.body,
      ...req.params,
      ...req.query,
      authorization: req.headers.authorization,
    };
    
    const { error, value } = schema
      .unknown(true)
      .validate(data, { abortEarly: false });

    if (error) {
      const message = error.details.map((e) => e.message).join(" | ");
      return next(createError({ message, statusCode: 400 }));
    }

    return next();
  };
};

export default globalValidateHandler;
