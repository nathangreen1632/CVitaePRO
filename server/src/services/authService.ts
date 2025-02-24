import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";
import { generateToken, verifyToken } from "../utils/jwtUtils";

const TOKEN_EXPIRATION_TIME = "3h";
const TOKEN_WARNING_TIME = 30 * 60 * 1000; // 30 minutes in milliseconds

export const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = verifyToken(token);
    if (!decoded || typeof decoded === "string") {
      return res.status(403).json({ message: "Invalid token" });
    }

    req.user = decoded as JwtPayload;

    // Check if token is about to expire and send a warning
    const exp = (decoded as JwtPayload).exp;
    if (exp && Date.now() >= exp * 1000 - TOKEN_WARNING_TIME) {
      res.setHeader("X-Token-Expiration-Warning", "true");
    }

    return next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

export const generateUserToken = (userId: string) => {
  return generateToken({ userId }, TOKEN_EXPIRATION_TIME);
};

export const protectRoutes = (req: Request, res: Response, next: NextFunction) => {
  authenticateUser(req, res, (err?: any) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized access" });
    }
    return next();
  });
};
