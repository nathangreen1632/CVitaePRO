import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";
import logger from "../register/logger";

interface JwtPayloadStructure {
  userId: string;
  id?: string;
  role?: string;
  username?: string;
  iat: number;
  exp: number;
}

export const generateToken = (
  id: string,
  role?: string,
  username?: string
): string => {
  return jwt.sign(
    { id, userId: id, role, username },
    JWT_SECRET,
    {
      expiresIn: "90m",
      issuer: "CVitaePRO",
      audience: "cvitaepro_users",
    }
  );
};

export const verifyToken = (token: string): JwtPayloadStructure | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayloadStructure;
  } catch (error) {
    logger.error("JWT Verification Error:", error);
    return null;
  }
};
