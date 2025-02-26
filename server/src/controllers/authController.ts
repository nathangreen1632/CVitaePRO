import { Request, Response } from "express";
import { loginUser, registerUser } from "../services/userService.js";
import { hashPassword, comparePassword } from "../utils/hash.js"; // ✅ Import password hashing function
import User from "../models/User.js";

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ error: "Username and password are required." });
    }

    // ✅ Hash the password BEFORE calling `registerUser`
    const hashedPassword = await hashPassword(password);

    // ✅ Now call `registerUser`, but with the hashed password
    const newUser = await registerUser({ username, password: hashedPassword });

    res.status(201).json({ message: "User registered successfully", userId: newUser.id });
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : "Unknown error" });
  }
}

/**
 * Logs in a user.
 */
 // ✅ Import password comparison function

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });

    if (!user) {
      res.status(401).json({ error: "Invalid credentials." });
    }

    // ✅ Compare the provided password with the hashed password
    const isMatch = user && await comparePassword(password, user.passwordHash);

    if (!isMatch) {
      res.status(401).json({ error: "Invalid credentials." });
    }

    // ✅ Now generate the token (handled by userService)
    const token = await loginUser(req.body);

    res.status(200).json({ token });
  } catch (error) {
    res.status(401).json({ error: error instanceof Error ? error.message : "Unknown error" });
  }
}
