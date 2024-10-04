import { hashSync } from 'bcrypt';

export const hashPassword = (password) => {
  return hashSync(password, 10);
};
