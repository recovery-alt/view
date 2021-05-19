import type { Gallery, Data, GalleryGroup, Group } from '@/typings';
import { cloneDeep } from 'lodash';
import { App } from 'vue';
import ComponentGroup from './group.vue';

const modules = import.meta.glob('./*/index.ts');

const groups: Data<any> = {};

for (const [key, module] of Object.entries(modules)) {
  const matcher = key.match(/\.\/(.*)\/index\.ts/);
  if (matcher?.[1]) {
    groups[matcher[1]] = module;
  }
}

export const galleryGroup: GalleryGroup = [];

export const galleryList: Array<Gallery> = [];

export default async (app: App) => {
  const resolveGroup = async (getGroup: () => Promise<{ [key: string]: any }>) => {
    const module = await getGroup();
    const group = module.default as Group;
    const { name: groupName, icon, components, order, dataConfig } = group;
    const list: Array<Gallery> = [];

    for (const [key, getModule] of Object.entries(components)) {
      const module = await getModule();
      const gallery = module.default;
      gallery.type = key;
      gallery.dataConfig = dataConfig || gallery.dataConfig;
      app.component(`cq-${key}`, gallery.component);

      list.push(gallery);
      galleryList.push(gallery);
    }
    galleryGroup[order] = { groupName, icon, list };
  };

  app.component('cq-group', ComponentGroup);
  for (const key in groups) await resolveGroup(groups[key]);
};

export const getGallery = (name: string) => {
  const gallery = galleryList.find(val => val.type === name);
  if (gallery) return cloneDeep(gallery);
};
