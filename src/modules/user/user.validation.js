import joi from "joi";
import { auth , user } from "../../utility/validationSchemas.js";

export const globalValidateUser = joi.object({
  authorization: auth.token,
});

export const changePassword = joi.object({
  oldPassword: user.password.required(),
  newPassword: user.password.required(),
});

export const changeEmail = joi.object({
  newEmail: user.email.required(),
});

export const changeData = joi.object({
  fullName: user.fullName,
  gender: user.gender,
  birthDate: user.birthDate,
  phone: user.phone,
});