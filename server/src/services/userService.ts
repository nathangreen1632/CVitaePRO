import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { JWT_SECRET } from "../config/env.js";
import { hashPassword, comparePassword } from "../utils/hash.js";
import { generateUserToken } from "./authService.js";
import logger from "../register/logger.js";

interface UserData {
  username: string;
  password: string;
  role?: "admin" | "user";
}

export const generateAccessToken = (user: InstanceType<typeof User>): string => {
  return jwt.sign(
    {
      userId: user.getDataValue("id"),
      username: user.getDataValue("username"),
      role: user.getDataValue("role"),
    },
    JWT_SECRET,
    { expiresIn: "90m" }
  );
};

export async function registerUser(userData: UserData): Promise<{ user: InstanceType<typeof User>; token: string } | null> {
  try {
    if (!userData.username || !userData.password) {
      logger.warn("Registration failed: Missing username or password.");
      return null;
    }

    const role = userData.role === "admin" ? "admin" : "user";
    const hashedPassword = await hashPassword(userData.password);

    const newUser = await User.create({
      username: userData.username,
      passwordhash: hashedPassword,
      role,
    });

    const token = generateUserToken(newUser.id, role);

    logger.info(`User '${userData.username}' registered successfully with role '${role}'.`);

    return { user: newUser, token };
  } catch (error) {
    logger.error(`Error registering user: ${error instanceof Error ? error.message : "Unknown error"}`);
    return null;
  }
}

export async function loginUser(credentials: UserData): Promise<string | null> {
  try {
    const user = await User.findOne({ where: { username: credentials.username } });

    if (!user) {
      logger.warn(`Login failed: User '${credentials.username}' not found.`);
      return null;
    }

    const isMatch = await comparePassword(credentials.password, user.passwordhash);

    logger.info(`Password match result for '${credentials.username}': ${isMatch}`);

    if (!isMatch) {
      logger.warn(`Login failed: Incorrect password for user '${credentials.username}'.`);
      return null;
    }

    const token = generateAccessToken(user);
    return token;
  } catch (error) {
    logger.error(`Error logging in user: ${error instanceof Error ? error.message : "Unknown error"}`);
    return null;
  }
}
