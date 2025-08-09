import jwt from "jsonwebtoken";
import createError from "./createError.js";
export const TOKEN_TYPES = {
  ACCESS_TOKEN: "email-confirmation",
  REFRESH_TOKEN: "reset-password",
  PASSWORD_TOKEN: "passwordToken",
};
Object.freeze(TOKEN_TYPES);
export const generateToken = ({ data, typeToken }) => {
  let tokenSettings;
  switch (typeToken) {
    case TOKEN_TYPES.ACCESS_TOKEN:
      tokenSettings = {
        secretKey: process.env.ACCESS_TOKEN_SECRET,
        expiresIn: "5m",
      };
      break;
    case TOKEN_TYPES.REFRESH_TOKEN:
      tokenSettings = {
        secretKey: process.env.REFRESH_TOKEN_SECRET,
        expiresIn: "7d",
      };
      break;
    case TOKEN_TYPES.PASSWORD_TOKEN:
      tokenSettings = {
        secretKey: process.env.PASSWORD_TOKEN_SECRET,
        expiresIn: "10m",
      };
      break;
    default:
      throw new Error("Invalid token type");
  }
  const token = jwt.sign(data, tokenSettings.secretKey, {
    expiresIn: tokenSettings.expiresIn,
  });

  return token;
};

export const decryptToken = ({ token, typeToken }) => {
  try {
    let secretKey;
    switch (typeToken) {
      case TOKEN_TYPES.ACCESS_TOKEN:
        secretKey = process.env.ACCESS_TOKEN_SECRET;
        break;
      case TOKEN_TYPES.REFRESH_TOKEN:
        secretKey = process.env.REFRESH_TOKEN_SECRET;
        break;
      case TOKEN_TYPES.PASSWORD_TOKEN:
        secretKey = process.env.PASSWORD_TOKEN_SECRET;
        break;
      default:
        throw new Error("Invalid token type");
    }
    const data = jwt.verify(token, secretKey);
    return { ...data };
  } catch (err) {
    throw createError({ message: err.message });
  }
};