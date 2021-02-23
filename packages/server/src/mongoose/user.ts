import { model, Schema, Document, Model } from 'mongoose';

const schema = new Schema({
  name: String,
  password: String,
});
interface User extends Document {
  name: string;
  password: string;
}

const user: Model<User> = model<User>('user', schema);

export { user };
