import { User, user } from '@/mongoose/user';
import { ResponseEnum } from '@/enum';
import { UpdateQuery } from 'mongoose';

class UserService {
  async get() {
    return await user.find();
  }

  async changePassword(id: string, password: string, newPassword: string) {
    const record = (await user.findById(id)) as UpdateQuery<User>;
    if (!record) {
      return Promise.resolve(ResponseEnum.CANNOT_FIND_USER);
    }

    if (record.password !== password) {
      return Promise.resolve(ResponseEnum.PASSWORD_ERROR);
    }

    record.password = newPassword;

    return await user.updateOne({ _id: id }, record);
  }
}

export const userService = new UserService();
