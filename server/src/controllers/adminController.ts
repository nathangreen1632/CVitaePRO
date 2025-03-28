import { Request, Response } from "express";
import { sequelize } from "../config/database.js";
import initModels from "../models/index.js";

const { UserAgreement, User } = initModels(sequelize);

export const getAdminDashboard = async (_req: Request, res: Response): Promise<void> => {
  try {
    res.json({ message: "Welcome Admin! You have full access." });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong." });
  }
};

export const getLegalAgreementLogs = async (_req: Request, res: Response): Promise<void> => {
  try {
    const logs = await UserAgreement.findAll({
      include: [
        {
          model: User,
          attributes: ["id", "username", "role"],
        },
      ],
      order: [["acceptedAt", "DESC"]],
    });

    const exportable = logs.map((log: any) => ({
      userId: log.userId,
      username: log.User?.username ?? "(unknown)",
      document: log.documentType,
      version: log.version,
      acceptedAt: log.acceptedAt,
    }));

    res.status(200).json({ logs: exportable });
  } catch (err) {
    console.error("Failed to retrieve legal agreement logs:", err);
    res.status(500).json({ error: "Unable to retrieve logs" });
  }
};
