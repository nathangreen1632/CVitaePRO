import redis from '../services/cacheService.js';

export const storeExtractedText = async (userId: string, fileHash: string, text: string, expiration: number) => {
  const key = `resume:${userId}:${fileHash}`;
  await redis.set(key, text, { EX: expiration });

};

export const getExtractedText = async (userId: string, fileHash: string): Promise<string | null> => {
  const key = `resume:${userId}:${fileHash}`;
  return await redis.get(key);
};

export const deleteExtractedText = async (userId: string, fileHash: string) => {
  const key = `resume:${userId}:${fileHash}`;
  await redis.del(key);
};

export const flushAllExtractedText = async () => {
  await redis.flushAll();
}