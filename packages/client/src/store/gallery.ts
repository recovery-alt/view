import { Gallery, GalleryGroup } from '@/typings';
import { defineStore } from 'pinia';
import cloneDeep from 'lodash/cloneDeep';
import Group from '@/gallery/group.vue';

export const useGalleryStore = defineStore('gallery', {
  state() {
    return {
      group: [] as Array<GalleryGroup>,
      list: [] as Array<Gallery>,
    };
  },
  actions: {
    setGroup(group: Array<GalleryGroup>) {
      this.group = group;
    },
    setList(list: Array<Gallery>) {
      this.list = list;
    },
    getGallery(name: string) {
      if (name === 'group') {
        const result: Gallery = {
          type: 'group',
          name: 'group',
          version: '1.0.0',
          component: Group,
        };
        return result;
      }
      const gallery = this.list.find(val => val.type === name);
      if (gallery) return cloneDeep(gallery);
    },
    getFilterGroup(keyword: string) {
      if (!keyword) return this.group;
      return this.group.map(group => {
        const { list: galleryList, ...rest } = group;
        const list = galleryList.filter(item => new RegExp(keyword, 'i').test(item.name));
        return { list, ...rest };
      });
    },
  },
});
