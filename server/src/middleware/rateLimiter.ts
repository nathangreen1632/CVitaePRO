import { Request, Response, NextFunction } from 'express';
import redis from '../services/cacheService.js';

const RATE_LIMITS = {
  adobe_upload: { window: 60, max: 1 },
  adobe_fetch: { window: 3600, max: 10 },
  openai: { window: 43200, max: 100 }
};

export const rateLimiter = (type: keyof typeof RATE_LIMITS) => async (req: Request, res: Response, next: NextFunction) => {
  const userId: string = req.user?.id || req.ip || '';
  const key = `rate_limit:${type}:${userId}`;

  const currentRequests = await redis.incr(key);

  if (currentRequests === 1) {
    await redis.expire(key, RATE_LIMITS[type].window);
  }

  if (currentRequests > RATE_LIMITS[type].max) {
    res.status(429).json({ message: 'Too many requests, please try again later.' });
    return;
  }

  next();
};
