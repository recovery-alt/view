import { user } from '@/mongoose';

class LoginService {
  checkPassword(name: string, password: string) {
    return user.findOne({ name, password });
  }
}

export const loginService = new LoginService();
