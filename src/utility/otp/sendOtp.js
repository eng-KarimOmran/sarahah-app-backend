import nodemailer from "nodemailer";
import generateEmailTemplate from "./generateEmailTemplate.js";
import { hashText } from "../encryption.js";
import generateOtp from "./generateOtp.js";
import { create, deleteMany } from "../../DB/servicesDB.js";
import otpModel from "../../DB/models/otp.model.js";

const sendOtp = async ({ username = "user", email, typeOtp }) => {
  const otp = generateOtp();
  const hashOtp = await hashText(otp);
  const subject = typeOtp;
  const expiresAt = Date.now() + 2 * 60 * 1000;

  await deleteMany(otpModel, { email, typeOtp });
  await create(otpModel, { otp: hashOtp, email, typeOtp, expiresAt });

  const html = generateEmailTemplate({
    username,
    otp,
    subject: typeOtp + " code",
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
