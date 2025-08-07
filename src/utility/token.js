import jwt from "jsonwebtoken";

export const generateToken = ({ data, typeToken }) => {
  let tokenSettings;
  switch (typeToken) {
    case "accessToken":
      tokenSettings = {
        secretKey: process.env.ACCESS_TOKEN_SECRET,
        expiresIn: "5m",
      };
      break;
    case "refreshToken":
      tokenSettings = {
        secretKey: process.env.ACCESS_TOKEN_SECRET,
        expiresIn: "5m",
      };
      break;
    case "passwordToken":
      tokenSettings = {
        secretKey: process.env.PASSWORD_TOKEN_SECRET,
        expiresIn: "15m",
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

export const decryptToken = ({ token, secretKey }) => {
  try {
    const decoded = jwt.verify(token, secretKey);
    return {
      success: true,
      payload: decoded,
    };
  } catch (err) {
    return {
      success: false,
      error: err.message,
    };
  }
};
