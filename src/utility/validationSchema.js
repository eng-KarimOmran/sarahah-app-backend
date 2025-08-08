import joi from "joi";
import { OTP_TYPES } from "../DB/models/otp.model.js";

export const userSchema = {
  fullName: joi.string().min(2).messages({
    "string.min": "Full name must be at least 2 characters.",
    "any.required": "fullName is required.",
    "string.empty": "fullName cannot be empty.",
  }),

  email: joi.string().email().messages({
    "string.email": "Email must be a valid email address.",
    "any.required": "Email is required.",
    "string.empty": "Email cannot be empty.",
  }),

  password: joi.string().min(8).messages({
    "string.min": "Password must be at least 8 characters.",
    "any.required": "Password is required.",
    "string.empty": "Password cannot be empty.",
  }),
};

export const authSchema = {
  otp: joi
    .string()
    .pattern(/^[0-9]{6}$/)
    .required()
    .messages({
      "string.empty": "OTP code is required.",
      "string.length": "OTP code must be exactly 6 digits.",
      "string.pattern.base": "OTP code must contain 6 digits.",
    }),

  typeOtp: joi
    .string()
    .valid(...Object.values(OTP_TYPES))
    .required()
    .messages({
      "any.only": `Invalid OTP type. Must be one of: ${Object.values(OTP_TYPES)}`,
      "any.required": "OTP type is required.",
    }),

  token: joi
    .string()
    .pattern(/^[A-Za-z0-9_-]{30,40}\.[A-Za-z0-9_-]{30,}\.[A-Za-z0-9_-]{43,64}$/)
    .required()
    .messages({
      "string.empty": "Token is required.",
      "string.pattern.base": "Invalid token format.",
    }),
};
