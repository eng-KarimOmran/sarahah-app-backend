import messageModel from "../../db/models/message.model.js";
import { create, find } from "../../db/serviceDB.js";
import createError from "../../utility/createError.js";
import createSuccess from "../../utility/createSuccess.js";

export const sendGuest = async (req, res, next) => {
  const { to, message } = req.body;
  await create(messageModel, { to, message });
  return createSuccess(res, { message: "Message sent successfully" });
};

export const sendUser = async (req, res, next) => {
  const { to, message } = req.body;
  await create(messageModel, { to, message, sender: req.user._id });
  return createSuccess(res, { message: "Message sent successfully" });
};

export const allMessages = async (req, res, next) => {
  const messages = await find(messageModel, {
    to: req.user._id,
  })
    .select("-to")
    .populate("sender", "_id fullName email urlImg");

  if (messages.length == 0) {
    return next(
      createError({ message: "Messages not found", statusCode: 404 })
    );
  }

  return createSuccess(res, {
    messages,
  });
};
