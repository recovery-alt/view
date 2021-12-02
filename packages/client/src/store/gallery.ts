import { Gallery, GalleryGroup } from '@/typings';
import { defineStore } from 'pinia';
import cloneDeep from 'lodash/cloneDeep';

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
      const gallery = this.list.find(val => val.type === name);
      if (gallery) return cloneDeep(gallery);
    },
  },
});
