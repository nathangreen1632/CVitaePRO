import redis from '../cache/redisCache.js';
import { sequelize } from '../config/database.js';

const testServices = async () => {
  try {
    // Test Redis
    await redis.set('test_key', 'Redis is working!', 'EX', 5);
    const redisTest = await redis.get('test_key');
    console.log('✅ Redis Test:', redisTest);

    // Test PostgreSQL
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connected successfully.');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await redis.quit();
  }
};

testServices();
