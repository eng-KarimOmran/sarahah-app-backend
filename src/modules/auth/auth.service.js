import changePasswordModel from "../../DB/models/changePassword.model.js";
import { OTP_TYPES } from "../../DB/models/otp.model.js";
import userModel from "../../DB/models/user.model.js";
import {
  create,
  deleteMany,
  findById,
  findOne,
  updateOne,
} from "../../DB/servicesDB.js";
import createError from "../../utility/createError.js";
import createSuccess from "../../utility/createSuccess.js";
import { compareText, hashText } from "../../utility/encryption.js";
import sendOtp from "../../utility/otp/sendOtp.js";
import {
  decryptToken,
  generateToken,
  TOKEN_TYPES,
} from "../../utility/token.js";

export const signup = async (req, res, next) => {
  const { fullName, email, password } = req.body;

  const hashPassword = await hashText(password);

  const user = await create(userModel, {
    fullName,
    email,
    password: {
      value: hashPassword,
    },
  });

  const info = await sendOtp({
    username: fullName,
    email,
    typeOtp: OTP_TYPES.EMAIL_CONFIRMATION,
  });

  const refreshToken = generateToken({
    data: { userId: user._id },
    typeToken: TOKEN_TYPES.REFRESH_TOKEN,
  });

  return createSuccess(res, {
    message: "Registration successful",
    status: 201,
    refreshToken,
  });
};

export const login = async (req, res, next) => {
  const { password } = req.body;

  const isMatch = await compareText(password, req.user.password.value);

  if (!isMatch) {
    return next(createError({ message: "Password is wrong", status: 400 }));
  }

  const refreshToken = generateToken({
    data: { userId: req.user._id },
    typeToken: TOKEN_TYPES.REFRESH_TOKEN,
  });

  return createSuccess(res, {
    status: 200,
    refreshToken,
  });
};

export const verifyOtp = async (req, res, next) => {
  const { typeOtp } = req.params;
  const { email } = req.body;
  switch (typeOtp) {
    case OTP_TYPES.EMAIL_CONFIRMATION:
      await updateOne(userModel, { email }, { isEmailConfirmed: true });
      return res.json(
        createSuccess(res, {
          message: "Email has been successfully confirmed.",
          status: 200,
        })
      );
    case OTP_TYPES.RESET_PASSWORD:
      const passwordToken = generateToken({
        data: { email },
        typeToken: "passwordToken",
      });
      await deleteMany(changePasswordModel, { email });
      await create(changePasswordModel, { email, passwordToken });
      return res.json(
        createSuccess(res, {
          message: "OTP code verified",
          passwordToken,
          status: 200,
        })
      );
    default:
      return next(
        createError({
          message: "Invalid token type",
          status: 400,
        })
      );
  }
};

export const resendOtp = async (req, res, next) => {
  const { typeOtp } = req.params;
  const { email } = req.body;
  await sendOtp({ username: req.user.fullName, email, typeOtp });

  return createSuccess(res, {
    message: "OTP has been resent successfully.",
    status: 200,
  });
};

export const changePassword = async (req, res, next) => {
  const { newPassword, email } = req.body;
  const { authorization } = req.headers;

  const data = decryptToken({
    token: authorization,
    typeToken: TOKEN_TYPES.PASSWORD_TOKEN,
  });

  const passwordChangeExists = await findOne(changePasswordModel, {
    email: data.email,
  });

  if (!passwordChangeExists) {
    return next(
      createError({
        message: "Invalid token",
        status: 400,
      })
    );
  }

  const hashPassword = await hashText(newPassword);

  await deleteMany(changePasswordModel, { email });

  await updateOne(
    userModel,
    { email },
    {
      password: { value: hashPassword, pwdChangedAt: Date.now() },
      isEmailConfirmed: true,
    }
  );

  return createSuccess(res, {
    message: "Password changed successfully.",
    status: 200,
  });
};

export const accessToken = async (req, res, next) => {
  const { authorization } = req.headers;

  const { userId, iat } = decryptToken({
    token: authorization,
    typeToken: TOKEN_TYPES.REFRESH_TOKEN,
  });

  const user = await findById(userModel, userId);

  if (!user) {
    return next(createError({ message: "user not found", status: 404 }));
  }

  const pwdChangedAt = parseInt(
    new Date(user.password.pwdChangedAt).getTime() / 1000
  );

  if (iat < pwdChangedAt) {
    return next(createError({ message: "Refresh Token is invalid" }));
  }

  const accessToken = generateToken({
    data: { userId },
    typeToken: TOKEN_TYPES.ACCESS_TOKEN,
  });

  return createSuccess(res, {
    accessToken,
  });
};
