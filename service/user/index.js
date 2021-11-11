"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const user_1 = require("@/mongoose/user");
const enum_1 = require("@/enum");
class UserService {
    async get() {
        return await user_1.user.find();
    }
    async changePassword(id, password, newPassword) {
        const record = await user_1.user.findById(id);
        if (!record) {
            return Promise.resolve(enum_1.ResponseEnum.CANNOT_FIND_USER);
        }
        if (record.password !== password) {
            return Promise.resolve(enum_1.ResponseEnum.PASSWORD_ERROR);
        }
        record.password = newPassword;
        return await user_1.user.updateOne({ _id: id }, record);
    }
}
exports.userService = new UserService();
