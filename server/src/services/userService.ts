import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { JWT_SECRET } from "../config/env.js";
import { hashPassword, comparePassword } from "../utils/hash.js"; // ✅ Import hash functions
import { generateUserToken } from "./authService.js" // ✅ Import generateToken function
import logger from "../register/logger.js"; // ✅ Import centralized logger


// ✅ Define the user data type strictly
interface UserData {
  username: string;
  password: string;
  role?: "admin" | "user";  // ✅ Ensure role is restricted to valid values
}

// ✅ Generate JWT Token
export const generateAccessToken = (user: InstanceType<typeof User>): string => {
  return jwt.sign(
    {
      userId: user.getDataValue("id"), // Standardize field name
      username: user.getDataValue("username"),
      role: user.getDataValue("role"),
    },
    JWT_SECRET,
    { expiresIn: "90m" }
  );
};


// ✅ Strictly typed user registration function
export async function registerUser(userData: UserData): Promise<{ user: InstanceType<typeof User>; token: string } | null> {
  try {
    if (!userData.username || !userData.password) {
      logger.warn("⚠️ Registration failed: Missing username or password.");
      return null;
    }

    // ✅ Default role to "user" if not provided
    const role = userData.role === "admin" ? "admin" : "user";
    const hashedPassword = await hashPassword(userData.password);

    // ✅ Ensure strict typing in User.create()
    const newUser = await User.create({
      username: userData.username,
      passwordhash: hashedPassword,
      role, // ✅ Ensure role is properly assigned
    });

    // ✅ Generate JWT Token after successful registration
    const token = generateUserToken(newUser.id, role);

    logger.info(`✅ User '${userData.username}' registered successfully with role '${role}'.`);

    return { user: newUser, token };
  } catch (error) {
    logger.error(`❌ Error registering user: ${error instanceof Error ? error.message : "Unknown error"}`);
    return null;
  }
}

// ✅ Strictly typed user login function
export async function loginUser(credentials: UserData): Promise<string | null> {
  try {
    const user = await User.findOne({ where: { username: credentials.username } });

    if (!user) {
      console.warn(`⚠️ Login failed: User '${credentials.username}' not found.`);
      return null;
    }

    const isMatch = await comparePassword(credentials.password, user.passwordhash);

    // ✅ Log password comparison result
    logger.info(`🔍 Password match result for '${credentials.username}': ${isMatch}`);

    if (!isMatch) {
      logger.warn(`⚠️ Login failed: Incorrect password for user '${credentials.username}'.`);
      return null;
    }

    const token = generateAccessToken(user);
    console.log(`✅ User '${credentials.username}' logged in successfully.`);
    return token;
  } catch (error) {
    console.log(`❌ Error logging in user: ${error instanceof Error ? error.message : "Unknown error"}`);
    return null;
  }
}

