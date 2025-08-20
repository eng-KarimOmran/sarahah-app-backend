import nodemailer from "nodemailer";
import generateEmailTemplate from "./generateEmailTemplate.js";
import { createOtp } from "../generateCode.js";
import { oneWayEncryption } from "../encryption.js";
import otpModel from "../../db/models/otp.model.js";
import { create, deleteMany } from "../../db/serviceDB.js";

const sendOtp = async ({ username = "user", email, otpType, exp = 2 }) => {
  const otp = createOtp();
  const hashOtp = await oneWayEncryption(otp);
  const subject = otpType.split("-").slice(0, 2).join(" ") + " code";
  const expTime = Date.now() + exp * 60 * 1000;

  await deleteMany(otpModel, { email, otpType });
  await create(otpModel, { otp: hashOtp, email, otpType, exp: expTime });

  const html = generateEmailTemplate({
    username,
    otp,
    subject,
  });

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    from: `"Sarahah App" <${process.env.EMAIL_USERNAME}>`,
    to: email,
    subject,
    html,
  });

  return info;
};

export default sendOtp;
