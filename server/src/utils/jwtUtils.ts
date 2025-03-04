import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";

interface JwtPayloadStructure {
  userId: string;
  id?: string;
  role?: string;
  iat: number;
  exp: number;
}

export const generateToken = (userId: string, role?: string): string => {
  return jwt.sign(
    { userId, role },
    JWT_SECRET,
    { expiresIn: "7d", issuer: "CVitaePRO", audience: "cvitaepro_users" }
  );
};

export const verifyToken = (token: string): JwtPayloadStructure | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayloadStructure;
  } catch (error) {
    return null;
  }
};
