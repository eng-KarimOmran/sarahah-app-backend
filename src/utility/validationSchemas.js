import joi from "joi";
import { genderTypes } from "../db/models/user.model.js";
import { otpTypes } from "../db/models/otp.model.js";

const today = new Date();
const maxAgeDate = new Date(new Date().setFullYear(today.getFullYear() - 5));
const minAgeDate = new Date(new Date().setFullYear(today.getFullYear() - 150));

export const user = {
  fullName: joi.string().min(2).max(100).messages({
    "string.empty": "Full name is required",
    "string.min": "Full name must be at least 2 characters",
    "string.max": "Full name must not exceed 100 characters",
  }),

  email: joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Please provide a valid email address",
  }),

  password: joi.string().min(8).messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 8 characters long",
  }),

  birthDate: joi.date().min(minAgeDate).max(maxAgeDate).messages({
    "date.base": "Birth date must be a valid date",
    "any.required": "Birth date is required",
    "date.min": "Age cannot be more than 150 years old",
    "date.max": "Age must be at least 12 years old",
  }),

  gender: joi
    .string()
    .valid(...Object.values(genderTypes))
    .messages({
      "any.only": `Gender must be one of: ${Object.values(genderTypes).join(
        ", "
      )}`,
      "string.empty": "Gender is required",
    }),

  phone: joi
    .string()
    .pattern(/^01(0|1|2|5)[0-9]{8}$/)
    .messages({
      "string.empty": "Phone number is required",
      "string.pattern.base": "Invalid phone number",
      "any.required": "Phone number is required",
    }),
};

export const auth = {
  otp: joi
    .string()
    .pattern(/^[0-9]{6}$/)
    .required()
    .messages({
      "string.pattern.base": "OTP must be a 6-digit number",
      "string.empty": "OTP is required",
      "any.required": "OTP is required",
    }),

  otpType: joi
    .string()
    .valid(...Object.values(otpTypes))
    .required()
    .messages({
      "any.only": `OTP type must be one of: ${Object.values(otpTypes).join(
        ", "
      )}`,
      "string.empty": "OTP type is required",
      "any.required": "OTP type is required",
    }),

  token: joi
    .string()
    .pattern(/^[a-zA-Z0-9_-]{36,}\.[a-zA-Z0-9_-]{3,}\.[a-zA-Z0-9_-]{40,}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid token format. Must be a valid JWT.",
      "string.empty": "Token is required",
      "any.required": "Token is required",
    }),
};

export const ObjectId = joi
  .string()
  .regex(/^[0-9a-fA-F]{24}$/)
  .required()
  .messages({
    "string.pattern.base": "ObjectId must be a valid ObjectId",
    "string.empty": "ObjectId is required",
  });

export const message = joi.string().required().messages({
  "string.empty": "message is required",
});
