import joi from "joi";
import { auth, message, ObjectId } from "../../utility/validationSchemas.js";

export const sendGuest = joi.object({
  to: ObjectId,
  message: message,
});

export const sendUser = joi.object({
  to: ObjectId,
  message: message,
  authorization: auth.token,
});

export const allMessages = joi.object({
  authorization: auth.token,
});