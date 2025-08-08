import { model, Schema } from "mongoose";
export const OTP_TYPES = {
  EMAIL_CONFIRMATION: "email-confirmation",
  RESET_PASSWORD: "reset-password",
};

Object.freeze(OTP_TYPES);

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
  otpAttemptCount: {
    type: Number,
    default: 0,
  },
  unblockDate: {
    type: Date,
  },
  expiresAt: {
    type: Date,
  },
  typeOtp: {
    type: String,
    required: true,
    enum: [...Object.values(OTP_TYPES)],
  },
});

schema.index({ email: 1, typeOtp: 1 }, { unique: true });

const otpModel = model("otp", schema);
export default otpModel;
