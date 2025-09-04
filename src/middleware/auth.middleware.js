import invalidTokenModel from "../db/models/invalidToken.model.js";
import userModel from "../db/models/user.model.js";
import { findOne } from "../db/serviceDB.js";
import createError from "../utility/createError.js";
import { tokenTypes, verifyToken } from "../utility/jwt.js";

const authMiddleware = (tokenType = tokenTypes.accessToken) => {
  return async (req, res, next) => {
    const { authorization } = req.headers;
    const decoded = verifyToken({ token: authorization, tokenType });

    const invalidToken = await findOne(invalidTokenModel, {
      jti: decoded.jti,
    });

    if (invalidToken) {
      return next(createError({ message: "The token is invalid" }));
    }

    const user = await findOne(userModel, { _id: decoded.userId });

    if (!user) {
      return next(createError({ message: "User not found", statusCode: 404 }));
    }

    const lastSensitiveChange =
      new Date(user.lastSensitiveChange).getTime() / 1000;

    if (lastSensitiveChange > decoded.iat) {
      return next(createError({ message: "The token is invalid" }));
    }

    req.user = user;
    req.jti = decoded.jti;
    return next();
  };
};

export default authMiddleware;