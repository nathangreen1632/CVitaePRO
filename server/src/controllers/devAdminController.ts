import { Request, Response } from "express";
import { sequelize } from "../config/database.js";
import initModels from "../models/index.js";

const { User } = initModels(sequelize);

export const promoteToAdmin = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    user.role = "admin";
    await user.save();

    res.json({ message: "You are now an admin!" });
    return;
  } catch (err) {
    console.error("Failed to promote user:", err);
    res.status(500).json({ error: "Promotion failed" });
    return;
  }
};
