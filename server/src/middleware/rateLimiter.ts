import { Request, Response, NextFunction } from 'express';
import redis from '../cache/redisCache.js';

const WINDOW_SIZE = 60; // 60 seconds
const MAX_REQUESTS = 10; // Allow 10 requests per minute during development

export const rateLimiter = async (req: Request, res: Response, next: NextFunction) => {
  const userIP: string = req.ip ?? '';
  const key = `rate_limit:${userIP}`;

  const currentRequests = await redis.incr(key);

  if (currentRequests === 1) {
    await redis.expire(key, WINDOW_SIZE);
  }

  if (currentRequests > MAX_REQUESTS) {
    res.status(429).json({ message: 'Too many requests, please try again later.' });
    return;
  }

  next();
};
