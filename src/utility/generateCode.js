import { customAlphabet, nanoid } from "nanoid";
export const createOtp = () => {
  const num = "0123456789";
  const otp = customAlphabet(num, 6)();
  return otp;
};

export const createJwtId = () => {
  const id = nanoid();
  return id;
};
