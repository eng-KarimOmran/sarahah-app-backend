import userModel from "../db/models/user.model.js";
import { findOne } from "../db/serviceDB.js";
import createError from "../utility/createError.js";

const findUser = (shouldExist = true) => {
  return async (req, res, next) => {
    const id = req?.decoded?.userId || req?.params?.userId;
    const email = req?.body?.email;
    let user = null;

    if (id) {
      user = await findOne(userModel, { _id: id });
    } else if (email) {
      user = await findOne(userModel, { email });
    }

    if (!user && shouldExist) {
      return next(createError({ message: "User not found", statusCode: 404 }));
    }

    if (user && !shouldExist) {
      return next(
        createError({ message: "The user already exists", statusCode: 400 })
      );
    }

    req.user = user;
    return next();
  };
};

export default findUser;
