import express, { Application } from "express";
import helmet from "helmet";

export const applyMiddleware = (app: Application): void => {
  app.use(express.json());
  app.use(helmet());
};
