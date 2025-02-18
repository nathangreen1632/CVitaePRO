import { User } from "../models/User";
import logger from "../register/logger";

export async function getUserById(userId: string): Promise<User> {
  const user = await User.findByPk(userId);

  if (!user) {
    logger.warn(`User with ID ${userId} not found, returning default fallback.`);

    return new User({
      id: -1,
      name: "Guest User",
      email: "guest@cvitaepro.com",
      passwordHash: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  return user;
}
