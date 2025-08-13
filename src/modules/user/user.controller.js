import { Router } from "express";
import * as userServices from "./user.service.js";
import uploadFile from "../../utility/multer/multer.js";
import auth, { authValidation } from "../../Middlewares/auth/auth.js";
import handelGlobalValidation from "../../Middlewares/handelGlobalValidation.js";
import findUser from "../../Middlewares/findUser.js";

const router = Router();
router.get("/profile/:userId", findUser(), userServices.getProfile);

router.use(handelGlobalValidation(authValidation), auth);

router.post(
  "/upload-img",
  findUser(),
  uploadFile().single("image"),
  userServices.uploadImgUser
);

router.get("/share-profile", findUser(), userServices.shareProfile);

router.patch("/change-password", findUser(), userServices.changePassword);

router.patch("/change-email", findUser(false), userServices.changeEmail);

router.patch("/change-name", findUser(), userServices.changeName);

export default router;
