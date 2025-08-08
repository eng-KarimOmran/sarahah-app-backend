import userModel from "../DB/models/user.model.js";
import { findById, findOne } from "../DB/servicesDB.js";
import createError from "../utility/createError.js";

const findUser = (shouldExist = true) => {
  return async (req, res, next) => {
    const userId = req.params?.userId;
    const email = req.body?.email;
    let user = {};

    if (userId) {
      user = await findById(userModel, userId);
    } else if (email) {
      user = await findOne(userModel, { email });
    } else {
      return next(
        createError({
          message: "User email or userId must be sent.",
          status: 400,
        })
      );
    }

    if (user && shouldExist) {
      req.user = user;
      return next();
    } else if (!user && shouldExist) {
      return next(createError({ message: "user not found", status: 404 }));
    } else if (user && !shouldExist) {
      return next(createError({ message: "User already exists", status: 400 }));
    }

    return next();
  };
};

export default findUser;
