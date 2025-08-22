import userModel from "../../db/models/user.model.js";
import { findOne, updateOne } from "../../db/serviceDB.js";
import cloudinary from "../../utility/cloudinary.js";
import createError from "../../utility/createError.js";
import createSuccess from "../../utility/createSuccess.js";
import fs from "fs";
import {
  compareText,
  oneWayEncryption,
  towWayEncryption,
  twoWayDecrypt,
} from "../../utility/encryption.js";
import sendOtp from "../../utility/otp/sendOtp.js";
import { otpTypes } from "../../db/models/otp.model.js";

export const uploadImg = async (req, res, next) => {
  const userName = req.user.fullName.split(" ").slice(0, 2).join("-");

  const result = await cloudinary.uploader.upload(req.file.path, {
    folder: `uploads/${req.user._id}-${userName}/profile`,
  });

  const publicId = req.user?.imgProfile?.publicId;

  if (publicId) {
    await cloudinary.uploader.destroy(publicId);
  }

  await updateOne(
    userModel,
    { _id: req.user._id },
    { imgProfile: { url: result.secure_url, publicId: result.public_id } }
  );

  fs.unlinkSync(req.file.path);
  return createSuccess(res, {
    message: "The image has been uploaded successfully",
  });
};

export const shareProfile = async (req, res, next) => {
  return createSuccess(res, {
    message: `${req.protocol}://${req.host}/user/profile/${req.user._id}`,
  });
};

export const getProfile = async (req, res, next) => {
  const { userId } = req.params;
  const user = await findOne(userModel, { _id: userId });

  if (!user || user.deleteAt) {
    return next(createError({ message: "user not found", statusCode: 404 }));
  }

  const { _id, fullName, email, imgProfile } = user;
  return createSuccess(res, {
    user: { _id, fullName, email, urlImg: imgProfile?.url },
  });
};

export const changePassword = async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  const isMatch = await compareText(oldPassword, req.user.password);

  if (!isMatch) {
    return next(createError({ message: "Password is wrong", statusCode: 400 }));
  }

  const hashedPassword = await oneWayEncryption(newPassword);

  await updateOne(
    userModel,
    { _id: req.user._id },
    { password: hashedPassword, lastSensitiveChange: Date.now() }
  );
  return createSuccess(res, {
    message: "The password has been changed successfully.",
  });
};

export const changeEmail = async (req, res, next) => {
  const { newEmail } = req.body;

  await updateOne(
    userModel,
    { _id: req.user._id },
    {
      email: newEmail,
      isConfirmedEmail: false,
      lastSensitiveChange: Date.now(),
    }
  );

  await sendOtp({
    username: req.user.fullName.split(" ").slice(0, 2).join(" "),
    email: newEmail,
    otpType: otpTypes.confirmEmail,
    exp: 2,
  });

  return createSuccess(res, {
    message: "Email changed successfully",
  });
};

export const changeData = async (req, res, next) => {
  const fullName = req.body?.fullName;
  const gender = req.body?.gender;
  const birthDate = req.body?.birthDate;
  const phone = req.body?.phone;
  let data = {};

  if (fullName) {
    data.fullName = fullName;
  }

  if (gender) {
    data.gender = gender;
  }

  if (birthDate) {
    data.birthDate = birthDate;
  }

  if (phone) {
    const phoneEncryption = towWayEncryption(phone);
    data.phone = phoneEncryption;
  }

  const update = await updateOne(
    userModel,
    { _id: req.user._id },
    {
      ...data,
    }
  );

  return createSuccess(res, {
    message: `Your ${Object.keys(data).join(
      " and "
    )} have been successfully changed.`,
  });
};

export const myData = async (req, res, next) => {
  const {
    _id,
    fullName,
    email,
    phone,
    isConfirmedEmail,
    gender,
    role,
    birthDate,
    imgProfile,
  } = req.user;

  const PhoneWithOutEncryption = twoWayDecrypt(phone);

  return createSuccess(res, {
    user: {
      _id,
      fullName,
      email: {
        value: email,
        isConfirmedEmail,
      },
      phone: PhoneWithOutEncryption,
      gender,
      role,
      birthDate,
      urlImg: imgProfile?.url,
    },
  });
};

export const deleteMyAccount = async (req, res, next) => {
  await updateOne(
    userModel,
    { _id: req.user._id },
    {
      deleteAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      lastSensitiveChange: Date.now(),
    }
  );
  return createSuccess(res, {
    message:
      "Your account has been scheduled for temporary deletion. If you do not log in within 30 days, it will be permanently removed.",
  });
};