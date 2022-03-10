"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initMongoose = void 0;
const tslib_1 = require("tslib");
const mongoose_1 = tslib_1.__importDefault(require("mongoose"));
const config_1 = require("@/config");
const picocolors_1 = tslib_1.__importDefault(require("picocolors"));
tslib_1.__exportStar(require("./user"), exports);
tslib_1.__exportStar(require("./page"), exports);
const initMongoose = () => {
    mongoose_1.default.connect(config_1.mongoUri);
    mongoose_1.default.connection.on('connected', () => {
        console.log(picocolors_1.default.green('Mongoose connection success'));
    });
    mongoose_1.default.connection.on('error', console.error.bind(console, 'connection error:'));
    mongoose_1.default.connection.on('disconnected', () => {
        console.log('Mongoose connection disconnected');
    });
};
exports.initMongoose = initMongoose;
