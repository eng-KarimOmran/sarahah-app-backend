import { Router } from "express";
import * as authService from "./auth.service.js";
import handelGlobalValidation from "../../Middlewares/handelGlobalValidation.js";
import * as authValidation from "./auth.validation.js";
import findUser from "../../Middlewares/findUser.js";
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
  "/reset-password",
  handelGlobalValidation(authValidation.resetPasswordValidation),
  findUser(),
  authService.resetPassword
);

router.post(
  "/resend-otp",
  handelGlobalValidation(authValidation.resendOtp),
  findUser(),
  authService.resendOtp
);

router.post(
  "/verify-otp",
  handelGlobalValidation(authValidation.verifyOtp),
  findUser(),
  authService.verifyOtp
);

router.post(
  "/change-password",
  handelGlobalValidation(authValidation.changePasswordValidation),
  findUser(),
  authService.changePassword
);
export default router;
