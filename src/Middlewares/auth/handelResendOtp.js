import otpModel, { OTP_TYPES } from "../../DB/models/otp.model.js";
import { deleteMany, findOne } from "../../DB/servicesDB.js";
import createError from "../../utility/createError.js";
import checkOtp from "../../utility/otp/checkOtp.js";
import sendOtp from "../../utility/otp/sendOtp.js";

export const handleResendOtp = async (req, res, next) => {
  const { email } = req.body;
  const { typeOtp } = req.params;

  const existingOtp = await findOne(otpModel, { email, typeOtp });

  if (req.user.handleResendOtp && typeOtp === OTP_TYPES.EMAIL_CONFIRMATION) {
    return next(
      createError({
        message: "Your email is already verified.",
        status: 400,
      })
    );
  }

  if (!existingOtp) {
    return next();
  }

  const { isSuccess, message } = checkOtp(existingOtp, false);
  if (!isSuccess) {
    return next(createError({ message, status: 400 }));
  }

  return next();
};

export default handleResendOtp;
