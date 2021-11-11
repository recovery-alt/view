"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.page = void 0;
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    title: String,
    description: String,
    author: String,
    width: Number,
    height: Number,
    pageMode: Number,
    backgroundColor: String,
    scale: Number,
    zoom: Number,
    gap: Number,
    url: String,
    components: Array,
});
const page = (0, mongoose_1.model)('page', schema);
exports.page = page;
