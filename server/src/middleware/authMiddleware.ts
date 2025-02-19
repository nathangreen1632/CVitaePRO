import { Request, Response, NextFunction } from 'express';

interface CustomRequest extends Request {
  user?: string; // Extend the Request type with the optional user property
}
import jwt from 'jsonwebtoken';

export const authenticateUser = (req: CustomRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Unauthorized: No token provided' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = typeof decoded === 'string' ? decoded : JSON.stringify(decoded);
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};
