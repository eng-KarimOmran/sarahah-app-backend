import { OTP_TYPES } from "../../DB/models/otp.model.js";
import userModel from "../../DB/models/user.model.js";
import { updateOne } from "../../DB/servicesDB.js";
import createError from "../../utility/createError.js";
import createSuccess from "../../utility/createSuccess.js";
import { compareText, hashText } from "../../utility/encryption.js";
import sendOtp from "../../utility/otp/sendOtp.js";
import { generateToken, TOKEN_TYPES } from "../../utility/token.js";

export const uploadImgUser = async (req, res, next) => {
  await updateOne(
    userModel,
    { _id: req.userId },
    { imgProfile: req.urlUpload }
  );

  return createSuccess(res, {
    message: "The image has been uploaded successfully",
  });
};

export const shareProfile = async (req, res, next) => {
  const urlProfile = `${req.protocol}://${req.host}/profile/${req.userId}`;
  return createSuccess(res, {
    urlProfile,
  });
};

export const getProfile = async (req, res, next) => {
  const { _id, fullName, email, imgProfile } = req.user;
  let urlImg = `${req.protocol}://${req.host}/`;
  if (imgProfile) {
    urlImg += imgProfile;
  } else {
    urlImg += "uploads/staticImages/user-profile.png";
  }
  return createSuccess(res, {
    user: {
      id: _id,
      fullName,
      email,
      urlImg,
    },
  });
};

export const changePassword = async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  const isMatch = await compareText(oldPassword, req.user.password.value);

  if (!isMatch) {
    return next(createError({ message: "old Password is wrong", status: 400 }));
  }

  const hashPassword = await hashText(newPassword);

  await updateOne(
    userModel,
    { _id: req.user._id },
    {
      password: { value: hashPassword, pwdChangedAt: Date.now() },
      isEmailConfirmed: true,
    }
  );

  const refreshToken = generateToken({
    data: { userId: req.user._id },
    typeToken: TOKEN_TYPES.REFRESH_TOKEN,
    version: 0.1,
  });

  return createSuccess(res, {
    message: "Your password has been changed successfully.",
    refreshToken,
  });
};

export const changeEmail = async (req, res, next) => {
  const { newEmail } = req.body;

  const info = await sendOtp({
    username: req.user.fullName,
    email: newEmail,
    typeOtp: OTP_TYPES.EMAIL_CONFIRMATION,
  });

  await updateOne(
    userModel,
    { _id: req.user._id },
    {
      email: newEmail,
      isEmailConfirmed: false,
    }
  );

  return createSuccess(res, {
    message: "Email has been changed.",
  });
};

export const changeName = async (req, res, next) => {
  const { newFullName } = req.body;

  await updateOne(
    userModel,
    { _id: req.user._id },
    {
      fullName: newFullName,
    }
  );

  return createSuccess(res, {
    message: "The name has been changed successfully.",
  });
};
