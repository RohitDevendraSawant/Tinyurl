const { createClient } = require('redis');

const connectToRedis = async () => {
  try {
    const redisClient = createClient({
      url: process.env.REDIS_URL,
    });
    redisClient.on('error', (err) => console.error('Redis Client Error', err));
    await redisClient.connect();
    console.log('Connected to Redis');
    return redisClient;
  } catch (error) {
    console.error('Error connecting to Redis:', error);
    process.exit(1);
  };
}

module.exports = connectToRedis;