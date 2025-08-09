import { authSchema, userSchema } from "../../utility/validationSchema.js";
import joi from "joi";

export const signupValidation = joi.object({
  fullName: userSchema.fullName.required(),
  email: userSchema.email.required(),
  password: userSchema.password.required(),
});

export const loginValidation = joi.object({
  email: userSchema.email.required(),
  password: userSchema.password.required(),
});

export const resetPasswordValidation = joi.object({
  email: userSchema.email.required(),
});

export const resendOtp = joi.object({
  email: userSchema.email.required(),
  typeOtp: authSchema.typeOtp,
});

export const verifyOtp = joi.object({
  email: userSchema.email.required(),
  otp: authSchema.otp,
  typeOtp: authSchema.typeOtp,
});

export const changePasswordValidation = joi.object({
  email: userSchema.email.required(),
  newPassword: userSchema.password.required(),
  authorization: authSchema.token,
});

export const getAccessTokenValidation = joi.object({
  refresh_token: authSchema.token,
});
