import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { generateToken, verifyToken } from '../utils/jwtUtils.js';
import User from '../models/User.js';
import logger from '../register/logger.js';

export interface CustomJwtPayload {
  userId: string;
  role?: string;
  iat: number;
  exp: number;
}

export const authenticateUser = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    logger.warn("Unauthorized access attempt: No token provided.");
    res.status(401).json({ message: "Unauthorized: No token provided" });
    return;
  }

  const decoded: CustomJwtPayload | null = verifyToken(token);
  if (!decoded) {
    logger.warn("Invalid token detected.");
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  req.user = { id: decoded.userId };
  next();
};

export const generateUserToken = (
  id: string,
  role?: string,
  username?: string
): string => {
  try {
    return generateToken(id, role, username);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Error generating token: ${error.message}`);
    } else {
      logger.error(`Error generating token: ${String(error)}`);
    }
    throw new Error("Error generating token.");
  }
};

export async function validateUserCredentials(username: string, password: string): Promise<{ token?: string; error?: string }> {
  const user = await User.findOne({ where: { username } });

  if (!user) {
    return { error: "Invalid credentials." };
  }

  const isMatch = await bcrypt.compare(password, user.passwordhash);

  if (!isMatch) {
    return { error: "Invalid credentials." };
  }

  const token = generateToken(user.id, user.role);
  return { token };
}
