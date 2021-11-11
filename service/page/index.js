"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pageService = void 0;
const page_1 = require("@/mongoose/page");
class PageService {
    get(id) {
        return id ? page_1.page.findById(id) : page_1.page.find();
    }
    delete(id) {
        return page_1.page.findByIdAndDelete(id);
    }
    add(record) {
        return page_1.page.create(record);
    }
    update(record) {
        return page_1.page.updateOne({ _id: record._id }, record);
    }
}
exports.pageService = new PageService();
