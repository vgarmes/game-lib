import { compare, hash, genSalt } from 'bcryptjs';

export const hashPassword = async (password: string) => {
  const salt = await genSalt(10);
  return hash(password, salt);
};

export const verifyPassword = async (
  candidatePassword: string,
  password: string
) => {
  return compare(candidatePassword, password);
};
