"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseEnum = void 0;
var ResponseEnum;
(function (ResponseEnum) {
    ResponseEnum[ResponseEnum["SUCCESS"] = 0] = "SUCCESS";
    ResponseEnum[ResponseEnum["USER_OR_PASSWORD_ERROR"] = 1] = "USER_OR_PASSWORD_ERROR";
    ResponseEnum[ResponseEnum["UNAUTHORIZED"] = 2] = "UNAUTHORIZED";
    ResponseEnum[ResponseEnum["PASSWORD_ERROR"] = 3] = "PASSWORD_ERROR";
    ResponseEnum[ResponseEnum["CANNOT_FIND_USER"] = 4] = "CANNOT_FIND_USER";
})(ResponseEnum = exports.ResponseEnum || (exports.ResponseEnum = {}));
