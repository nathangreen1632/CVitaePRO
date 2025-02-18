import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST ?? '127.0.0.1',
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASS ?? '',
});
console.log('Redis host:', process.env.REDIS_HOST);
redis.on('connect', () => console.log('✅ Redis connected successfully.'));
redis.on('error', (err) => console.error('❌ Redis connection error:', err));
console.log(`✅ Redis client created successfully: ${redis.options.host}:${redis.options.port}`);

export default redis;
