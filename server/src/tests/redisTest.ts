import redis from '../cache/redisCache.js';

const testRedis = async () => {
  await redis.set('test_key', 'Hello, Redis!', 'EX', 5);
  const value = await redis.get('test_key');
  console.log('Redis test value:', value);

  await redis.quit();
};

testRedis().catch(console.error);
