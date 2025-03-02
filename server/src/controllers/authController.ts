import { Request, Response } from "express";
import { loginUser, registerUser } from "../services/userService.js"; // ✅ Included registerUser
import { hashPassword, comparePassword } from "../utils/hash.js"; // ✅ Included hashPassword
import User from "../models/User.js";
import logger from "../register/logger.js";  // ✅ Ensure logger is used

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { username, password, role } = req.body;

    if (!username || !password) {
      res.status(400).json({ error: "Username and password are required." });
      return;
    }

    const userRole = role === "admin" ? "admin" : "user";
    const hashedPassword = await hashPassword(password); // ✅ Use hashPassword
    const newUser: User | null = await registerUser({ username, password: hashedPassword, role: userRole });

    if (!newUser) {
      logger.error(`❌ Registration failed for '${username}'. User object is null.`);
      res.status(500).json({ error: "User registration failed. Please try again." });
      return;  // ✅ Prevent further execution if newUser is null
    }

    logger.info(`✅ New user registered: '${username}' with role '${userRole}'`);
    res.status(201).json({ message: "User registered successfully", userId: newUser.id });

  } catch (error) {
    logger.error(`❌ Registration Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    res.status(400).json({ error: error instanceof Error ? error.message : "Unknown error" });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { username, password } = req.body;
    const user: User | null = await User.findOne({ where: { username } });

    if (!user) {
      logger.warn(`⚠️ Login failed: User '${username}' not found.`);
      res.status(401).json({ error: "Invalid credentials." });
      return;
    }

    const isMatch: boolean = await comparePassword(password, user.passwordHash); // ✅ Ensure password is compared correctly

    if (!isMatch) {
      logger.warn(`⚠️ Login failed: Incorrect password for user '${username}'.`);
      res.status(401).json({ error: "Invalid credentials." });
      return;
    }

    const token = await loginUser({ username, password }); // ✅ Ensure loginUser is called correctly

    logger.info(`✅ User '${username}' logged in successfully.`);
    res.status(200).json({ token });
  } catch (error) {
    logger.error(`❌ Login Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    res.status(500).json({
      error: "Internal server error",
      details: process.env.NODE_ENV === "development" && error instanceof Error ? error.message : undefined,  // ✅ Only show error details in development mode when error is an instance of Error
    });
  }
}
