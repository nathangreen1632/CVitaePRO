import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { generateToken, verifyToken } from "../utils/jwtUtils.js";  // ✅ Import from jwtUtils
import User from "../models/User.js";
import logger from "../register/logger.js";

// Standardized JWT payload structure
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

export const generateUserToken = (userId: string, role?: string): string => {
  try {
    return generateToken(userId, role);
  } catch (error) {
    logger.error("Token generation failed:", error);
    throw new Error("Failed to generate authentication token.");
  }
};

// ✅ Validate User Credentials (Handles Password Check & Token Issuance)
export async function validateUserCredentials(username: string, password: string): Promise<{ token?: string; error?: string }> {
  const user = await User.findOne({ where: { username } });

  if (!user) {
    return { error: "Invalid credentials." };
  }

  // ✅ Compare the entered password with the stored hash
  const isMatch = await bcrypt.compare(password, user.passwordhash);

  console.log("Entered Password:", password);
  console.log("Stored Hash:", user.passwordhash);
  console.log("Password Match Result:", isMatch);

  if (!isMatch) {
    return { error: "Invalid credentials." };
  }

  // ✅ Generate JWT if credentials are correct
  const token = generateToken(user.id, user.role);
  return { token };
}