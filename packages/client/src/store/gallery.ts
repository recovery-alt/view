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
    setGroup(index: number, group: GalleryGroup) {
      this.group[index] = group;
    },
    pushList(gallery: Gallery) {
      this.list.push(gallery);
    },
    getGallery(name: string) {
      const gallery = this.list.find(val => val.type === name);
      if (gallery) return cloneDeep(gallery);
    },
  },
});
