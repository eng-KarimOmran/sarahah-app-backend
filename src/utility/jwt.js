import jwt from "jsonwebtoken";
import createError from "./createError.js";
import { createJti } from "./generateCode.js";

export const tokenTypes = {
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  passwordToken: "passwordToken",
};

export const createToken = ({ tokenType, data, jti = createJti() }) => {
  let config = {};

  switch (tokenType) {
    case tokenTypes.refreshToken:
      config = {
        privateKey: process.env.REFRESH_TOKEN_SECRET,
        expiresIn: "7d",
      };
      break;
    case tokenTypes.accessToken:
      config = {
        privateKey: process.env.ACCESS_TOKEN_SECRET,
        expiresIn: "5m",
      };
    case tokenTypes.passwordToken:
      config = {
        privateKey: process.env.PASSWORD_TOKEN_SECRET,
        expiresIn: "15m",
      };
      break;
    default:
      throw createError({ message: "Invalid token type" });
  }

  const { privateKey, expiresIn } = config;
  return jwt.sign(data, privateKey, { expiresIn, jwtid: jti });
};

export const verifyToken = ({ token, tokenType }) => {
  try {
    let privateKey;
    switch (tokenType) {
      case tokenTypes.refreshToken:
        privateKey = process.env.REFRESH_TOKEN_SECRET;
        break;
      case tokenTypes.accessToken:
        privateKey = process.env.ACCESS_TOKEN_SECRET;
      case tokenTypes.passwordToken:
        privateKey = process.env.PASSWORD_TOKEN_SECRET;
        break;
      default:
        throw createError({ message: "Invalid token type" });
    }
    const decoded = jwt.verify(token, privateKey);
    return decoded;
  } catch (error) {
    throw createError({ message: error.message });
  }
};
