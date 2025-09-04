import { Router } from "express";
import * as messageService from "./message.service.js";
import authMiddleware from "../../middleware/auth.middleware.js";
import { tokenTypes } from "../../utility/jwt.js";
import globalValidateHandler from "../../middleware/globalValidateHandler.middleware.js";
import * as validationMessage from "./message.validation.js";

const router = Router();

router.post(
  "/send/guest",
  globalValidateHandler(validationMessage.sendGuest),
  messageService.sendGuest
);

router.post(
  "/send/user",
  globalValidateHandler(validationMessage.sendUser),
  authMiddleware(tokenTypes.accessToken),
  messageService.sendUser
);

router.get(
  "/get-all-messages",
  globalValidateHandler(validationMessage.allMessages),
  authMiddleware(tokenTypes.accessToken),
  messageService.allMessages
);
export default router;