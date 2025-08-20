import { Router } from "express";
import authMiddleware from "../../middleware/auth.middleware.js";
import { tokenTypes } from "../../utility/jwt.js";
import * as userService from "./user.service.js";
import upload, { uploadTypes } from "../../utility/multer.js";
import globalValidateHandler from "../../middleware/globalValidateHandler.middleware.js";
import * as validationSchema from "./user.validation.js";

const router = Router();

router.get("/profile/:userId", userService.getProfile);

router.use(
  globalValidateHandler(validationSchema.globalValidateUser),
  authMiddleware(tokenTypes.accessToken)
);

router.patch(
  "/upload-img",
  upload({ formats: uploadTypes.img }).single("image"),
  userService.uploadImg
);

router.get("/share-profile", userService.shareProfile);

router.patch(
  "/change-password",
  globalValidateHandler(validationSchema.changePassword),
  userService.changePassword
);

router.patch(
  "/change-email",
  globalValidateHandler(validationSchema.changeEmail),
  userService.changeEmail
);

router.patch(
  "/change-data",
  globalValidateHandler(validationSchema.changeData),
  userService.changeData
);

router.delete("/delete-my-account", userService.deleteMyAccount);

router.get("/my-Data", userService.myData);
export default router;
