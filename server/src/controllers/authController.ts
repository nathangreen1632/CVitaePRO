import { Request, Response } from "express";
import { loginUser, registerUser } from "../services/userService.js";

/**
 * Registers a new user.
 */
export async function register(req: Request, res: Response) {
  try {
    const user = await registerUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: (error instanceof Error ? error.message : "Unknown error") });
  }
}

/**
 * Logs in a user.
 */
export async function login(req: Request, res: Response) {
  try {
    const token = await loginUser(req.body);
    res.status(200).json({ token });
  } catch (error) {
    res.status(401).json({ error: error instanceof Error ? error.message : "Unknown error" });
  }
}
