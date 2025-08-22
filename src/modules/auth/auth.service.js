import invalidTokenModel from "../../db/models/invalidToken.model.js";
import otpModel, { otpTypes } from "../../db/models/otp.model.js";
import userModel from "../../db/models/user.model.js";
import { create, deleteMany, findOne, updateOne } from "../../db/serviceDB.js";
import createError from "../../utility/createError.js";
import createSuccess from "../../utility/createSuccess.js";
import {
  compareText,
  oneWayEncryption,
  towWayEncryption,
} from "../../utility/encryption.js";
import { createJti } from "../../utility/generateCode.js";
import { createToken, tokenTypes } from "../../utility/jwt.js";
import sendOtp from "../../utility/otp/sendOtp.js";

export const signup = async (req, res, next) => {
  const { fullName, email, phone, password, birthDate, gender } = req.body;

  const hashedPassword = await oneWayEncryption(password);
  const phoneEncryption = towWayEncryption(phone);
  const user = await create(userModel, {
    fullName,
    email,
    phone: phoneEncryption,
    password: hashedPassword,
    birthDate,
    gender,
  });

  const username = user.fullName.split(" ").slice(0, 2).join(" ");

  const info = await sendOtp({
    username,
    email: user.email,
    otpType: otpTypes.confirmEmail,
  });

  const jwtid = createJti();

  const refreshToken = createToken({
    data: { userId: user._id },
    tokenType: tokenTypes.refreshToken,
    jwtid,
  });

  const accessToken = createToken({
    data: { userId: user._id },
    tokenType: tokenTypes.accessToken,
    jwtid,
  });

  return createSuccess(res, {
    status: 201,
    message: "user added",
    refreshToken,
    accessToken,
  });
};

export const login = async (req, res, next) => {
  const { password } = req.body;

  const user = req.user;

  const isMatch = await compareText(password, user.password);

  if (!isMatch) {
    return next(createError({ message: "Password is wrong", statusCode: 400 }));
  }

  await updateOne(userModel, { _id: user._id }, { deleteAt: null });
  const jwtid = createJti();

  const refreshToken = createToken({
    data: { userId: user._id },
    tokenType: tokenTypes.refreshToken,
    jwtid,
  });

  const accessToken = createToken({
    data: { userId: user._id },
    tokenType: tokenTypes.accessToken,
    jwtid,
  });

  return createSuccess(res, {
    status: 200,
    refreshToken,
    accessToken,
  });
};

export const verifyOtp = async (req, res, next) => {
  const { otpType } = req.params;
  const { otp, email } = req.body;

  const user = req.user;

  const otpExists = await findOne(otpModel, { email, otpType });

  if (!otpExists) {
    return next(createError({ message: "Request a code first" }));
  }

  if (otpExists.blockedUntil && otpExists.blockedUntil > Date.now()) {
    return next(
      createError({
        message:
          "For your security, this action has been temporarily blocked. Please try again later.",
      })
    );
  }

  if (otpExists.blockedUntil && otpExists.blockedUntil < Date.now()) {
    otpExists.attempts = 0;
    otpExists.blockedUntil = null;
  }

  const isMatch = await compareText(otp, otpExists.otp);

  if (!isMatch) {
    const attempts = otpExists.attempts + 1;
    const blockedUntil = attempts >= 5 ? Date.now() + 1000 * 60 * 5 : null;
    await updateOne(otpModel, { email, otpType }, { attempts, blockedUntil });
    return next(createError({ message: "The code is invalid" }));
  }

  if (otpExists.exp < Date.now()) {
    return next(createError({ message: "This code has expired" }));
  }

  await deleteMany(otpModel, { email, otpType });

  switch (otpType) {
    case otpTypes.confirmEmail:
      await updateOne(userModel, { _id: user._id }, { isConfirmedEmail: true });
      return createSuccess(res, {
        message: "Email has been successfully confirmed.",
        status: 200,
      });

    case otpTypes.resetPassword:
      const passwordToken = createToken({
        tokenType: tokenTypes.passwordToken,
        data: { userId: user._id },
      });
      return createSuccess(res, {
        message: "Code verified successfully",
        passwordToken,
        status: 200,
      });
  }
};

export const resendOtp = async (req, res, next) => {
  const { otpType } = req.params;

  const { email } = req.body;
  const user = req.user;

  const otpExists = await findOne(otpModel, { email, otpType });

  if (otpExists && otpExists.blockedUntil > Date.now()) {
    return next(
      createError({
        message:
          "For your security, this action has been temporarily blocked. Please try again later.",
      })
    );
  }

  if (otpExists && otpExists.exp > Date.now()) {
    return next(
      createError({ message: "Code already sent. Check your email." })
    );
  }

  if (otpType == otpTypes.confirmEmail && user.isConfirmedEmail) {
    return next(
      createError({
        message:
          "The email has already been confirmed, you do not need to request a code.",
      })
    );
  }

  const info = await sendOtp({ username: user.fullName, email, otpType });

  return createSuccess(res, { message: "The code has been sent successfully" });
};

export const changePassword = async (req, res, next) => {
  const { newPassword } = req.body;
  const user = req.user;
  const hashedPassword = await oneWayEncryption(newPassword);

  await updateOne(
    userModel,
    { _id: user._id },
    {
      isConfirmedEmail: true,
      password: hashedPassword,
      lastSensitiveChange: Date.now(),
    }
  );

  return createSuccess(res, {
    message: "Your password has been changed successfully.",
  });
};

export const getAccessToken = async (req, res, next) => {
  const user = req.user;
  const jwtid = req.jwtid;
  const accessToken = createToken({
    data: { userId: user._id },
    tokenType: tokenTypes.accessToken,
    jwtid,
  });

  return createSuccess(res, {
    accessToken,
  });
};

export const logout = async (req, res, next) => {
  const { logoutType } = req.params;
  const jti = req.jti;
  const user = req.user;
  switch (logoutType) {
    case "device":
      await create(invalidTokenModel, {
        jti,
        exp: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      });
      break;
    case "all-device":
      await updateOne(
        userModel,
        { _id: user._id },
        { lastSensitiveChange: Date.now() }
      );
      break;
    default:
      return next(createError("logoutType Must be device, all-device"));
  }

  return createSuccess(res, {
    message: "You are logged out",
  });
};