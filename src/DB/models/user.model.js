import { model, Schema } from "mongoose";

const schema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      value: { type: String, required: true },
      pwdChangedAt: { type: Date, default: Date.now() },
    },
    imgProfile: {
      type: String,
    },
    isEmailConfirmed: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    provider: {
      type: String,
      default: "system",
    },
  },
  {
    timestamps: true,
  }
);

const userModel = model("users", schema);

export default userModel;
