import waitingTime from "../waitingTime.js";

const checkOtp = (existingOtp, shouldNotExpired = true) => {
  const now = Date.now();
  const { unblockDate, expiresAt } = existingOtp;

  if (unblockDate && unblockDate > now) {
    const { message } = waitingTime(unblockDate);
    return {
      isSuccess: false,
      message: `We noticed suspicious activity. Please wait ${message} before trying again.`,
    };
  }

  if (shouldNotExpired && expiresAt >= now) {
    return {
      isSuccess: true,
      message: `The code is not expired`,
    };
  } else if (shouldNotExpired && expiresAt < now) {
    return {
      isSuccess: false,
      message: `The code has expired`,
    };
  }

  if (!shouldNotExpired && expiresAt > now) {
    const { message } = waitingTime(expiresAt);
    return {
      isSuccess: false,
      message: `A valid OTP already exists. Wait ${message} before requesting a resend.`,
    };
  }

  return {
    isSuccess: true,
    message: "You can request a new OTP.",
  };
};

export default checkOtp;
