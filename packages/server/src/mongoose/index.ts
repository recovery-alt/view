import mongoose from 'mongoose';
import { mongoUri } from '@/config';
import chalk from 'chalk';

export * from './user';
export * from './page';

export const initMongoose = () => {
  mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
  mongoose.connection.on('connected', () => {
    console.log(chalk.green('Mongoose connection success'));
  });
  mongoose.connection.on('error', console.error.bind(console, 'connection error:'));

  mongoose.connection.on('disconnected', () => {
    console.log('Mongoose connection disconnected');
  });
};
