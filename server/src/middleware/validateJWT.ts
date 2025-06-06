import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwtUtils.js";

export interface AuthenticatedRequest extends Omit<Request, "user"> {
  user?: {
    userId: string;
    id?: string;
    role?: string | undefined;
    iat: number;
    exp: number;
  };
}

export const validateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized - No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    res.status(403).json({ error: "Unauthorized - Invalid token" });
    return;
  }

  req.user = decoded;
  next();
};

export const requireAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  if (!req.user || req.user.role !== "admin") {
    res.status(403).json({ error: "Forbidden - Admins only" });
    return;
  }
  next();
};
