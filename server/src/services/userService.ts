import User from "../models/User.js";
import logger from "../register/logger.js";

export async function getUserById(userId: string): Promise<User> {
  const user = await User.findByPk(userId);

  if (!user) {
    logger.warn(`User with ID ${userId} not found, returning default fallback.`);

    return new User({
      id: -1,
      username: 'Admin',
      passwordHash: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  return user;
}
