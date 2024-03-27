import mongoose, { ConnectOptions } from 'mongoose';
import MongoStore from 'connect-mongo';
import config from './env';
import { ConnectionError } from '../errors';

export const connectToDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(config.mongoose.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);
    console.log('Connected to MongoDB');

    const db = mongoose.connection;

    db.on('error', (err: Error) => {
      throw new ConnectionError(err.message);
    });

    db.on('disconnected', () => {
      console.warn('MongoDB disconnected');

      // Try to reconnect after 5 seconds
      setTimeout(() => {
        mongoose.connect(config.mongoose.url, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        } as ConnectOptions);
      }, 5000);
    });

    db.on('reconnected', () => {
      console.log('MongoDB reconnected');
    });
  } catch (error) {
    throw new ConnectionError(`Error connecting to MongoDB: ${error}`);
  }
};

export const store = MongoStore.create({
  mongoUrl: config.mongoose.url,
  collectionName: config.session.collectionName,
});
