import express, { Application } from 'express';
import helmet from 'helmet';
import { rateLimiter } from './rateLimiter.js';

export const applyMiddleware = (app: Application): void => {
  app.use(express.json()); // Parse JSON requests
  app.use(helmet()); // Security headers
  app.use(rateLimiter); // Apply rate limiting globally
};
