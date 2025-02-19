import express, { Application } from "express";
import helmet from "helmet";

export const applyMiddleware = (app: Application): void => {
  app.use(express.json()); // Parse JSON requests
  app.use(helmet()); // Security headers
};
