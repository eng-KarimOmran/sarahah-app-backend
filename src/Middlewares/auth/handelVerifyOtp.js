import otpModel from "../../DB/models/otp.model.js";
import { deleteMany, findOne, updateOne } from "../../DB/servicesDB.js";
import createError from "../../utility/createError.js";
import { compareText } from "../../utility/encryption.js";
import checkOtp from "../../utility/otp/checkOtp.js";

export const handelVerifyOtp = async (req, res, next) => {
  const { otp, email } = req.body;
  const { typeOtp } = req.params;

  const existingOtp = await findOne(otpModel, { email, typeOtp });

  if (!existingOtp) {
    return next(createError({ message: "Invalid OTP", status: 400 }));
  }

  const { isSuccess, message } = checkOtp(existingOtp);

  if (!isSuccess) {
    return next(createError({ message, status: 400 }));
  }

  const isMatch = await compareText(otp, existingOtp.otp);

  if (!isMatch) {
    const newOtpAttemptCount = existingOtp.otpAttemptCount + 1;
    const data = { otpAttemptCount: newOtpAttemptCount };

    if (newOtpAttemptCount >= 5) {
      data.unblockDate = Date.now() + 5 * 60 * 1000;
    }

    await updateOne(otpModel, { email, typeOtp }, data);

    return next(
      createError({
        message: "Invalid OTP",
        status: 400,
      })
    );
  }

  await deleteMany(otpModel, { email, typeOtp });

  return next();
};

export default handelVerifyOtp;
