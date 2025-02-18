import jwt from 'jsonwebtoken';

const JWT_SECRET: string = process.env.JWT_SECRET ?? 'default_secret';

export const generateToken = (userId: string): string => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token: string): string | object => {
  return jwt.verify(token, JWT_SECRET);
};
