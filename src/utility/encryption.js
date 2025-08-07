import bcrypt from "bcrypt";

export const hashText = async (text) => {
  const saltRounds = Number(process.env.SALT_ROUNDS);
  const hashText = await bcrypt.hash(text, saltRounds);
  return hashText;
};

export const compareText = async (text, hashedText) => {
  const isMatch = await bcrypt.compare(text, hashedText);
  return isMatch;
};