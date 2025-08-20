import joi from "joi";
import { auth, user } from "../../utility/validationSchemas.js";

export const signup = joi.object({
  fullName: user.fullName.required(),
  email: user.email,
  phone: user.phone.required(),
  password: user.password.required(),
  birthDate: user.birthDate.required(),
  gender: user.gender.required(),
});

export const login = joi.object({
  email: user.email,
  password: user.password.required(),
});

export const verifyOtp = joi.object({
  otpType: auth.otpType,
  email: user.email,
  otp: auth.otp,
});

export const resendOtp = joi.object({
  otpType: auth.otpType,
  email: user.email,
});

export const changePassword = joi.object({
  authorization: auth.token,
  newPassword: user.password,
});

export const getAccessToken = joi.object({
  authorization: auth.token,
});

export const logout = joi.object({
  authorization: auth.token,
  logoutType: joi.string().valid("device", "all-device").required().messages({
    "any.only": "Logout type must be either 'device' or 'all-device'",
    "string.empty": "Logout type is required",
    "any.required": "Logout type is required",
  }),
});
