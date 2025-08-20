import { model, Schema } from "mongoose";

export const otpTypes = {
  confirmEmail: "confirm-email",
  resetPassword: "reset-password",
};

const schema = new Schema({
  otp: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    ref: "User",
    required: true,
  },

  exp: {
    type: Date,
    required: true,
  },

  attempts: {
    type: Number,
    default: 0,
  },

  blockedUntil: {
    type: Date,
    default: null,
  },

  otpType: {
    type: String,
    required: true,
    enum: Object.values(otpTypes),
  },
});

schema.index({ email: 1, otpType: 1 }, { unique: true });
const otpModel = model("otp", schema);
export default otpModel;
