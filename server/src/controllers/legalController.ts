import { Request, Response } from "express";
import { sequelize } from "../config/database.js";
import initModels from "../models/index.js";

const { UserAgreement } = initModels(sequelize);

export const saveAgreementConfirmation = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const { documentType, version } = req.body;

  if (!documentType || !version) {
    res.status(400).json({ error: "Missing documentType or version" });
    return;
  }

  try {
    await UserAgreement.create({
      userId,
      documentType,
      version,
      acceptedAt: new Date(),
    });

    res.status(201).json({ message: "Agreement recorded" });
    return;
  } catch (error) {
    console.error("Failed to save agreement:", error);
    res.status(500).json({ error: "Failed to save agreement" });
    return;
  }
};
