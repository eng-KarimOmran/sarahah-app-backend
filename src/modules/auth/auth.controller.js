import { Router } from "express";
import * as authService from "./auth.service.js";
import handelGlobalValidation from "../../Middlewares/handelGlobalValidation.js";
import * as authValidation from "./auth.validation.js";
import findUser from "../../Middlewares/findUser.js";
import handelVerifyOtp from "../../Middlewares/auth/handelVerifyOtp.js";
import handleResendOtp from "../../Middlewares/auth/handelResendOtp.js";
const router = Router();

router.post(
  "/signup",
  handelGlobalValidation(authValidation.signupValidation),
  findUser(false),
  authService.signup
);

router.post(
  "/login",
  handelGlobalValidation(authValidation.loginValidation),
  findUser(),
  authService.login
);

router.post(
  "/verify-otp/:typeOtp",
  handelGlobalValidation(authValidation.verifyOtp),
  findUser(),
  handelVerifyOtp,
  authService.verifyOtp
);

router.post(
  "/resend-otp/:typeOtp",
  handelGlobalValidation(authValidation.resendOtp),
  findUser(),
  handleResendOtp,
  authService.resendOtp
);

router.post(
  "/change-password",
  handelGlobalValidation(authValidation.changePasswordValidation),
  findUser(),
  authService.changePassword
);
export default router;
