import { Request, Response, NextFunction, RequestHandler } from "express";
// import logger from "../register/logger.js";
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
    console.warn("❌ Unauthorized: No token provided.");
    res.status(401).json({ error: "Unauthorized: No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);

  console.log("🛠 Debug Middleware: Decoded Token ->", decoded); // ✅ LOGGING TOKEN DATA

  if (!decoded || !decoded.userId) {
    console.warn("❌ Unauthorized: Invalid token.");
    res.status(403).json({ error: "Invalid token" });
    return;
  }

  req.user = {
    ...decoded,
    id: decoded.userId, // ✅ FORCE userId TO BE SET!
  };

  console.log("🛠 Debug Middleware: Assigned req.user ->", req.user); // ✅ CONFIRM req.user BEFORE NEXT()
  next();
};


