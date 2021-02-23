import { page, Page } from '@/mongoose/page';

class PageService {
  get(id?: string) {
    return id ? page.findById(id) : page.find();
  }

  add(record: Page) {
    return page.create(record);
  }

  update(record: Page) {
    return page.updateOne({ _id: record._id }, record);
  }
}

export const pageService = new PageService();
