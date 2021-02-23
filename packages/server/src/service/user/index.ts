import { user } from '@/mongoose/user';

class UserService {
  async get() {
    return await user.find();
  }
}

export const userService = new UserService();
