import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { JWT_SECRET } from "../config/env.js";
import { hashPassword, comparePassword } from "../utils/hash.js"; // ✅ Import hash functions

interface UserData {
  username: string;
  password: string;
}

export async function registerUser(userData: UserData) {
  const hashedPassword = await hashPassword(userData.password); // ✅ Use `hashPassword`
  return await User.create({ ...userData, passwordHash: hashedPassword } as any);
}

export async function loginUser(credentials: UserData) {
  const user = await User.findOne({ where: { username: credentials.username } });
  if (!user || !(await comparePassword(credentials.password, user.passwordHash))) { // ✅ Use `comparePassword`
    throw new Error("Invalid credentials.");
  }
  return jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });
}
