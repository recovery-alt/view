"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginService = void 0;
const mongoose_1 = require("@/mongoose");
class LoginService {
    checkPassword(name, password) {
        return mongoose_1.user.findOne({ name, password });
    }
}
exports.loginService = new LoginService();
