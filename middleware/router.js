"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRouter = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const useRouter = async (app) => {
    const prefix = '/api/v1/';
    const dirname = (0, path_1.resolve)(__dirname, `..${prefix}`);
    const files = (0, fs_1.readdirSync)(dirname);
    for (let i = 0, len = files.length; i < len; i++) {
        const file = files[i];
        const matcher = file.match(/^([a-zA-Z-_]+)\.[tj]s/);
        const { default: router } = await Promise.resolve().then(() => __importStar(require(`..${prefix}${file}`)));
        router.prefix(`${prefix}${matcher?.[1]}`);
        app.use(router.routes()).use(router.allowedMethods());
    }
};
exports.useRouter = useRouter;
