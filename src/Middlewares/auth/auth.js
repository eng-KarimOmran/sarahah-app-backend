import joi from "joi";
import { decryptToken, TOKEN_TYPES } from "../../utility/token.js";
import { authSchema } from "../../utility/validationSchema.js";

export const authValidation = joi.object({
  authorization: authSchema.token,
});

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  const { userId } = decryptToken({
    token: authorization,
    typeToken: TOKEN_TYPES.ACCESS_TOKEN,
  });

  req.userId = userId;
  return next();
};

export default auth;
