import { createClient } from "redis";

const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST!,
    port: Number(process.env.REDIS_PORT)
  },
  password: process.env.REDIS_PASSWORD!,
  username: process.env.REDIS_USERNAME! // ✅ Include Redis Cloud username
});

redisClient.connect().catch(console.error); // ✅ Ensure Redis connects properly

export async function getCachedResponse(cacheKey: string): Promise<any | null> {
  if (!cacheKey) return null;

  const cachedResponse = await redisClient.get(cacheKey);
  if (!cachedResponse) return null;

  try {
    return JSON.parse(cachedResponse);
  } catch {
    console.warn("Cached response is not valid JSON. Returning raw data.");
    return cachedResponse;
  }
}

export async function setCachedResponse(cacheKey: string, value: any, ttl: number = 43200) {
  await redisClient.setEx(cacheKey, ttl, JSON.stringify(value));
}

export default redisClient;