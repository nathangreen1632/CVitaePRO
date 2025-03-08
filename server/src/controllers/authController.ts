import { Request, Response } from "express";
import { loginUser, registerUser } from "../services/userService.js"; // ✅ Included registerUser
import { validateUserCredentials } from "../services/authService.js"; // ✅ Included validateUserCredentials
import logger from "../register/logger.js";

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { username, password, role } = req.body;

    if (!username || !password) {
      res.status(400).json({ error: "Username and password are required." });
      return;
    }

    const userRole = role === "admin" ? "admin" : "user";
    const { user: newUser } = await registerUser({
      username,
      password,  // Pass plain text password
      role: userRole
    }) || { user: null, token: null };



    if (!newUser) {
      logger.error(`❌ Registration failed for '${username}'. User object is null.`);
      res.status(500).json({ error: "User registration failed. Please try again." });
      return;  // ✅ Prevent further execution if newUser is null
    }

    logger.info(`✅ New user registered: '${username}' with role '${userRole}'`);
    res.status(201).json({
      message: "User registered successfully",
      userId: newUser?.getDataValue("id")
    });

  } catch (error) {
    logger.error(`❌ Registration Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    res.status(400).json({ error: error instanceof Error ? error.message : "Unknown error" });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { username, password } = req.body;

    // ✅ You can still call loginUser if needed
    const token = await loginUser({ username, password });

    if (!token) {
      // ✅ If loginUser fails, we attempt the password validation process via validateUserCredentials
      const result = await validateUserCredentials(username, password);
      if (result.error) {
        res.status(401).json({ error: result.error });
        return;
      }
      // ✅ Send token from validateUserCredentials if validation is successful
      res.status(200).json({ token: result.token });
      return;
    }

    res.status(200).json({ token }); // ✅ Send token directly if loginUser works fine
    return;
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
}


