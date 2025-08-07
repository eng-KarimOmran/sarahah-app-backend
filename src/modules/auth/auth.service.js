import changePasswordModel from "../../DB/models/changePassword.model.js";
import otpModel from "../../DB/models/otp.model.js";
import userModel from "../../DB/models/user.mode.js";
import {
  create,
  deleteMany,
  findOne,
  updateMany,
  updateOne,
} from "../../DB/servicesDB.js";
import createError from "../../utility/createError.js";
import createSuccess from "../../utility/createSuccess.js";
import { compareText, hashText } from "../../utility/encryption.js";
import sendOtp from "../../utility/otp/sendOtp.js";
import { decryptToken, generateToken } from "../../utility/token.js";
import waitingTime from "../../utility/waitingTime.js";

export const signup = async (req, res, next) => {
  const { fullName, email, password } = req.body;

  const hashPassword = await hashText(password);

  const user = await create(userModel, {
    fullName,
    email,
    password: hashPassword,
  });

  const info = await sendOtp({
    username: fullName,
    email,
    typeOtp: "Email confirmation",
  });

  const accessToken = generateToken({
    data: { userId: user._id },
    typeToken: "accessToken",
  });
  const refreshToken = generateToken({
    data: { userId: user._id },
    typeToken: "refreshToken",
  });

  return createSuccess(res, {
    message: "Registration successful",
    status: 201,
    accessToken,
    refreshToken,
  });
};

export const login = async (req, res, next) => {
  const { password } = req.body;

  const isMatch = await compareText(password, req.user.password);

  if (!isMatch) {
    return next(createError({ message: "Password is wrong", status: 400 }));
  }
  const accessToken = generateToken({
    data: { userId: req.user._id },
    typeToken: "accessToken",
  });
  const refreshToken = generateToken({
    data: { userId: req.user._id },
    typeToken: "refreshToken",
  });

  return createSuccess(res, {
    status: 200,
    accessToken,
    refreshToken,
  });
};

export const verifyOtp = async (req, res, next) => {
  const { otp, email } = req.body;
  const { typeOtp } = req.query;

  const existingOtp = await findOne(otpModel, { email, typeOtp });

  if (!existingOtp) {
    return next(
      createError({
        message: "No OTP request found. Please request a code first.",
        status: 404,
      })
    );
  }

  if (existingOtp.isBlocked) {
    return next(
      createError({
        message:
          "We've detected suspicious activity. Please request a new code.",
        status: 400,
      })
    );
  }

  const newAttempts = existingOtp.attempts + 1;

  await updateOne(
    otpModel,
    { email, typeOtp },
    {
      attempts: existingOtp.attempts + 1,
      lastAttemptDate: Date.now(),
      isBlocked: newAttempts >= 5 ? true : false,
    }
  );

  const isMatch = await compareText(otp, existingOtp.otp);

  if (!isMatch) {
    return next(
      createError({
        message: "The OTP you entered is invalid. Please check and try again.",
        status: 400,
      })
    );
  }

  if (existingOtp.expiresAt < Date.now()) {
    return next(
      createError({
        message: "The OTP code has expired. Please request a new one.",
        status: 400,
      })
    );
  }

  await deleteMany(otpModel, { email, typeOtp });

  switch (typeOtp) {
    case "Email confirmation":
      await updateOne(userModel, { email }, { isEmailConfirmed: true });
      return createSuccess(res, {
        message: "Your email has been successfully confirmed.",
        status: 200,
      });

    case "Reset password":
      const passwordToken = generateToken({
        data: { id: req.user._id },
        typeToken: "passwordToken",
      });
      await deleteMany(changePasswordModel, { email });
      await create(changePasswordModel, { passwordToken, email });
      return createSuccess(res, {
        message: "OTP verified successfully.",
        status: 200,
        passwordToken,
      });

    default:
      return next(
        createError({
          message: "Invalid OTP type.",
          status: 400,
        })
      );
  }
};

export const resendOtp = async (req, res, next, typeOtp) => {
  const { email } = req.body;
  typeOtp = req.query.typeOtp || typeOtp;

  const existingOtp = await findOne(otpModel, { email, typeOtp });
  console.log({ email, typeOtp });
  if (!existingOtp) {
    return next(
      createError({
        message: "No OTP request found. Please request a code first.",
        status: 404,
      })
    );
  }

  if (existingOtp.isBlocked) {
    const lastAttemptDate = new Date(existingOtp.lastAttemptDate).getTime();
    const blockedUntil = lastAttemptDate + 5 * 60 * 1000;
    const { secondsLeft, message } = waitingTime(blockedUntil);

    if (secondsLeft > 0) {
      return next(
        createError({
          message: `We've detected suspicious activity. Please wait ${message} before requesting a new code.`,
          status: 400,
        })
      );
    }
  }

  const { secondsLeft, message } = waitingTime(existingOtp.expiresAt);

  if (secondsLeft > 0) {
    return next(
      createError({
        message: `An OTP has already been sent. Please wait ${message} before requesting another one.`,
        status: 400,
      })
    );
  }

  await sendOtp({ username: req.user.fullName, email, typeOtp });

  return createSuccess(res, {
    message: "OTP has been resent successfully.",
    status: 200,
  });
};

export const resetPassword = async (req, res, next) => {
  const { email } = req.body;
  const typeOtp = "Reset password";

  const existingOtp = await findOne(otpModel, { email, typeOtp });

  if (existingOtp) {
    return resendOtp(req, res, next, typeOtp);
  }

  const info = await sendOtp({
    username: req.user.fullName,
    email,
    typeOtp,
  });

  return createSuccess(res, {
    message: "Verification otp sent",
    status: 200,
  });
};

export const changePassword = async (req, res, next) => {
  const { email, password, passwordToken } = req.body;
  const data = decryptToken({
    token: passwordToken,
    secretKey: process.env.PASSWORD_TOKEN_SECRET,
  });
  if (!data.success) {
    return next(
      createError({
        message: "Invalid token",
        status: 400,
      })
    );
  }

  const passwordChangeExists = await findOne(changePasswordModel, { email });

  if (!passwordChangeExists) {
    return next(
      createError({
        message: "Invalid token",
        status: 400,
      })
    );
  }
  const hashPassword = await hashText(password);

  await deleteMany(changePasswordModel, { email });

  await updateOne(userModel, { password: hashPassword });

  return createSuccess(res, {
    message: "Password changed successfully.",
    status: 200,
  });
};
