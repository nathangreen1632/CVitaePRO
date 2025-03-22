import { createClient } from "redis";
import logger from "../register/logger.js";

const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST!,
    port: Number(process.env.REDIS_PORT),
    reconnectStrategy: retries => (retries > 3 ? false : Math.min(retries * 50, 500))
  },
  password: process.env.REDIS_PASSWORD!,
  username: process.env.REDIS_USERNAME!
});

redisClient.on("error", (err) => logger.error("❌ Redis Client Error", err));
redisClient.on("connect", () => logger.info("✅ Redis Client Connected"));
redisClient.on("reconnecting", () => logger.warn("♻️ Redis Client Reconnecting"));
redisClient.on("end", () => logger.info("🔌 Redis Client Disconnected"));

redisClient.connect().catch(logger.error);

export async function getCachedResponse(cacheKey: string): Promise<any | null> {
  if (!cacheKey) return null;

  const cachedResponse = await redisClient.get(cacheKey);
  if (!cachedResponse) return null;

  try {
    return JSON.parse(cachedResponse);
  } catch {
    logger.warn("Cached response is not valid JSON. Returning raw data.");
    return cachedResponse;
  }
}

export async function setCachedResponse(cacheKey: string, value: any, ttl: number = 7200) {
  await redisClient.setEx(cacheKey, ttl, JSON.stringify(value));
}

export async function deleteCachedResponse(cacheKey: string) {
  await redisClient.del(cacheKey);
}

export default redisClient;
