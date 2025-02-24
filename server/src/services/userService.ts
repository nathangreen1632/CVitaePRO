import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js"; // ✅ Use default import
import { JWT_SECRET } from "../config/env.js";

interface UserData {
  username: string;
  password: string;
}

export async function registerUser(userData: UserData) { // ✅ Use `UserData` type
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  return await User.create({ ...userData, password: hashedPassword } as any);
}

export async function loginUser(credentials: UserData) { // ✅ Use `UserData` type
  const user = await User.findOne({ where: { username: credentials.username } });
  if (!user || !(await bcrypt.compare(credentials.password, user.password!))) {
    throw new Error("Invalid credentials.");
  }
  return jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });
}
