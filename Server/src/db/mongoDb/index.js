const mongoose = require('mongoose');
const { DB_NAME } = require('../../constants');

const connectToDatabase = async () => {
  try {
    const mongoInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  };
};

module.exports = connectToDatabase;