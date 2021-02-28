import mongoose from 'mongoose';

const MONGO_URL = process.env.MONGO_URL || '';

export const connectDb = async () => {
  await mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = mongoose.connection;
  db.on('error', () => {
    throw new Error('Error connecting');
  });
};
