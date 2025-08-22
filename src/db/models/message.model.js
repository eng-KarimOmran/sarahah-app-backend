import { model, Schema, Types } from "mongoose";

const schema = new Schema(
  {
    message: {
      type: String,
      required: true,
    },

    sender: {
      type: Types.ObjectId,
      ref: "User",
      default: null,
    },

    to: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const messageModel = model("Message", schema);
export default messageModel;
