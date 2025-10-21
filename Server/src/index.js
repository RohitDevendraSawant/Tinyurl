const app = require('./app');
const connectToDatabase = require('./db/mongoDb');
const connectToRedis = require('./db/redis');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectToDatabase();

    const redisClient = await connectToRedis();

    app.locals.redisClient = redisClient;

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

