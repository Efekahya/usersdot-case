import bcrypt from "bcrypt";

export const encryptPass = async (password: string) => {
  return await bcrypt.hash(password, 10);
};

export const comparePass = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash);
};
