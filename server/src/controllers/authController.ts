import { Request, Response } from "express";
import { loginUser, registerUser } from "../services/userService.js";
import { validateUserCredentials } from "../services/authService.js";
import pool from "../db/pgClient.js";
import bcrypt from "bcrypt";
import logger from "../register/logger.js";
import { verifyToken, generateToken } from "../utils/jwtUtils.js";

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { username, password, role } = req.body;

    if (!username || !password) {
      res.status(400).json({ error: "Username and password are required." });
      return;
    }

    const userRole = role === "admin" ? "admin" : "user";
    const { user: newUser, token } =
    (await registerUser({ username, password, role: userRole })) ||
    { user: null, token: null };

    if (!newUser || !token) {
      logger.error(`❌ Registration failed for '${username}'.`);
      res.status(500).json({ error: "User registration failed. Please try again." });
      return;
    }

    logger.info(`✅ New user registered: '${username}' with role '${userRole}'`);
    res.status(201).json({
      message: "User registered successfully",
      userId: newUser.getDataValue("id"),
      token,
    });


  } catch (error) {
    logger.error(`❌ Registration Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    res.status(400).json({ error: error instanceof Error ? error.message : "Unknown error" });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { username, password } = req.body;
    const token = await loginUser({ username, password });

    if (!token) {
      const result = await validateUserCredentials(username, password);
      if (result.error) {
        res.status(401).json({ error: result.error });
        return;
      }
      res.status(200).json({ token: result.token });
      return;
    }

    res.status(200).json({ token });
  } catch (error) {
    logger.error("❌ Login Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function changePassword(req: Request, res: Response): Promise<void> {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user?.id;

    if (!userId || !currentPassword || !newPassword) {
      res.status(400).json({ error: "Missing user ID or passwords." });
      return;
    }

    const result = await pool.query("SELECT passwordhash FROM users WHERE id = $1", [userId]);

    if (result.rowCount === 0) {
      res.status(404).json({ error: "User not found." });
      return;
    }

    const isValid = await bcrypt.compare(currentPassword, result.rows[0].passwordhash);

    if (!isValid) {
      res.status(401).json({ error: "Incorrect current password." });
      return;
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    await pool.query("UPDATE users SET passwordhash = $1 WHERE id = $2", [hashedPassword, userId]);

    logger.info(`🔑 Password changed for user ${userId}`);
    res.status(200).json({ message: "Password changed successfully." });
  } catch (error) {
    logger.error("❌ Password Change Error:", error);
    res.status(500).json({ error: "Something went wrong while updating password." });
  }
}

export async function refreshToken(req: Request, res: Response): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      res.status(401).json({ error: "No token provided" });
      return;
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    if (!decoded?.userId) {
      res.status(403).json({ error: "Invalid token" });
      return;
    }

    const newToken = generateToken(decoded.userId, decoded.role);

    res.status(200).json({ token: newToken });
  } catch (error) {
    logger.error("❌ Error refreshing token:", error);
    res.status(500).json({ error: "Token refresh failed" });
  }
}
