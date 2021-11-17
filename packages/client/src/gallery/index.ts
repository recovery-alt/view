import type { Gallery, Data, Group } from '@/typings';
import { App } from 'vue';
import ComponentGroup from './group.vue';
import { useGalleryStore } from '@/store';

const modules = import.meta.glob('./*/index.ts');

const groups: Data<any> = {};

for (const [key, module] of Object.entries(modules)) {
  const matcher = key.match(/\.\/(.*)\/index\.ts/);
  if (matcher?.[1]) {
    groups[matcher[1]] = module;
  }
}

export default async (app: App<Element>) => {
  const galleryStore = useGalleryStore();

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
      galleryStore.pushList(gallery);
    }
    galleryStore.setGroup(order, { groupName, icon, list });
  };

  app.component('cq-group', ComponentGroup);
  for (const key in groups) await resolveGroup(groups[key]);
};
