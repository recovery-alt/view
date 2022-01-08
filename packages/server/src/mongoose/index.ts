import mongoose from 'mongoose';
import { mongoUri } from '@/config';
import pc from 'picocolors';

export * from './user';
export * from './page';

export const initMongoose = () => {
  mongoose.connect(mongoUri);
  mongoose.connection.on('connected', () => {
    console.log(pc.green('Mongoose connection success'));
  });
  mongoose.connection.on('error', console.error.bind(console, 'connection error:'));

  mongoose.connection.on('disconnected', () => {
    console.log('Mongoose connection disconnected');
  });
};
