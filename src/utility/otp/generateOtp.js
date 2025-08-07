import { customAlphabet } from "nanoid";
const generateOtp = () => {
  const alphabet = "0123456789";
  const otp = customAlphabet(alphabet, 6)();
  return otp;
};

export default generateOtp;