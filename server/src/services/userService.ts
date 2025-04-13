import {comparePassword, hashPassword} from '../utils/hash.js';
import logger from '../register/logger.js';
import {generateToken} from '../utils/jwtUtils.js';
import {generateUserToken} from './authService.js';
import {IUser} from '../models/User';
import { sequelize } from "../config/database.js";
import initModels from "../models/index.js";

const { User } = initModels(sequelize);


interface UserData {
  username: string;
  password: string;
  role?: "admin" | "user";
}

export async function registerUser(userData: UserData): Promise<{ user: InstanceType<typeof User>; token: string } | null> {
  try {
    if (!userData.username || !userData.password) {
      logger.warn("Registration failed: Missing username or password.");
      return null;
    }

    const role: 'admin' | 'user' = userData.role === 'admin' ? 'admin' : 'user';
    const hashedPassword: string = await hashPassword(userData.password);

    const newUser: IUser = await User.create({
      username: userData.username,
      passwordhash: hashedPassword,
      role,
    });

    const token: string = generateUserToken(newUser.id, role, newUser.username);
    return { user: newUser, token };
  } catch (error) {
    logger.error(`Error registering user: ${error instanceof Error ? error.message : "Unknown error"}`);
    return null;
  }
}

export async function loginUser(credentials: UserData): Promise<string | null> {
  try {
    const user: IUser | null = await User.findOne({ where: { username: credentials.username } });

    if (!user) {
      logger.warn(`Login failed: User '${credentials.username}' not found.`);
      return null;
    }

    const isMatch: boolean = await comparePassword(credentials.password, user.passwordhash);

    if (!isMatch) {
      logger.warn(`Login failed: Incorrect password for user '${credentials.username}'.`);
      return null;
    }

    return generateToken(user.getDataValue("id"), user.getDataValue("role"), user.getDataValue("username"));
  } catch (error) {
    logger.error(`Error logging in user: ${error instanceof Error ? error.message : "Unknown error"}`);
    return null;
  }
}
