import bcrypt from 'bcryptjs';
import config from '../config/env';

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(Number(config.salt));
  return await bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, userPassword: string) {
  return await bcrypt.compare(password, userPassword);
}
