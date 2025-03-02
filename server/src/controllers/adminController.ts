import { Request, Response } from "express";

export const getAdminDashboard = async (_req: Request, res: Response): Promise<void> => {
  try {
    res.json({ message: "Welcome Admin! You have full access." });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong." });
  }
};
