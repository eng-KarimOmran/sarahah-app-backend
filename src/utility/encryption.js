import bcrypt from "bcrypt";
import CryptoJS from "crypto-js";

export const oneWayEncryption = async (text) => {
  const hashText = await bcrypt.hash(text, 10);
  return hashText;
};

export const compareText = async (text, hashedText) => {
  return await bcrypt.compare(text, hashedText);
};

export const towWayEncryption = (text) => {
  return CryptoJS.AES.encrypt(
    text,
    process.env.TWO_WAY_ENCRYPTION_KEY
  ).toString();
};

export const twoWayDecrypt = (text) => {
  const bytes = CryptoJS.AES.decrypt(text, process.env.TWO_WAY_ENCRYPTION_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};
