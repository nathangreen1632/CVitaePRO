import { RequestHandler } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";

export const validateToken: RequestHandler = (req, res, next) => { // ✅ Use RequestHandler
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET) as JwtPayload; // ✅ Ensure `req.user` exists
    next(); // ✅ Pass control to next middleware
  } catch (error) {
    res.status(403).json({ error: "Invalid token" });
  }
};
