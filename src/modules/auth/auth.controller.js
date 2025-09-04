import { Router } from "express";
import * as authService from "./auth.service.js";
import findUser from "../../middleware/findUser.middleware.js";
import globalValidateHandler from "../../middleware/globalValidateHandler.middleware.js";
import * as validationSchema from "./auth.validation.js";
import authMiddleware from "../../middleware/auth.middleware.js";
import { tokenTypes } from "../../utility/jwt.js";

const router = Router();

router.post(
  "/signup",
  globalValidateHandler(validationSchema.signup),
  findUser(false),
  authService.signup
);

router.post(
  "/login",
  globalValidateHandler(validationSchema.login),
  findUser(true),
  authService.login
);

router.post(
  "/verify-otp/:otpType",
  globalValidateHandler(validationSchema.verifyOtp),
  findUser(true),
  authService.verifyOtp
);

router.post(
  "/resend-otp/:otpType",
  globalValidateHandler(validationSchema.resendOtp),
  findUser(true),
  authService.resendOtp
);

router.patch(
  "/change-password",
  globalValidateHandler(validationSchema.changePassword),
  authMiddleware(tokenTypes.passwordToken),
  authService.changePassword
);

router.get(
  "/access-token",
  globalValidateHandler(validationSchema.getAccessToken),
  authMiddleware(tokenTypes.refreshToken),
  authService.getAccessToken
);

router.post(
  "/logout/:logoutType",
  globalValidateHandler(validationSchema.logout),
  authMiddleware(tokenTypes.accessToken),
  authService.logout
);
export default router;
