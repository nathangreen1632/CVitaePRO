import { Response } from "express";

export function handleError(res: Response, message: string, statusCode = 500) {
  return res.status(statusCode).json({ success: false, message });
}
