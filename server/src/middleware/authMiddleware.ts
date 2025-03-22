import { Request, Response, NextFunction, RequestHandler } from "express";
import { verifyToken } from "../utils/jwtUtils.js";

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    id: string;
    role?: string | undefined;
    iat: number;
    exp: number;
  };
}

export const authenticateUser: RequestHandler = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized: No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);

  if (!decoded || !decoded.userId) {
    res.status(403).json({ error: "Invalid token" });
    return;
  }

  req.user = {
    ...decoded,
    id: decoded.userId,
  };

  next();
};
