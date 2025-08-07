import { model, Schema } from "mongoose";

const schema = new Schema({
  otp: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    ref: "users",
  },
  attempts: {
    type: Number,
    default: 0,
  },
  lastAttemptDate: {
    type: Date,
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  expiresAt: {
    type: Date,
  },
  typeOtp: {
    type: String,
    required: true,
    enum: ["Email confirmation", "Reset password", "Two factor authentication"],
  },
});

schema.index({ email: 1, typeOtp: 1 }, { unique: true });

const otpModel = model("otp", schema);
export default otpModel;
