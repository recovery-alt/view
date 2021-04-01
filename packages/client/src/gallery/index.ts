import { App } from 'vue';
import ComponentGroup from './group.vue';

const modules = import.meta.glob('./*/index.ts');

const groups: Data<any> = {};

for (const [key, module] of Object.entries(modules)) {
  const matcher = key.match(/\.\/(.*)\/index\.ts/);
  if (matcher && matcher[1]) {
    groups[matcher[1]] = module;
  }
}

const galleryGroup: GalleryGroup = [];

const galleryList: Array<Gallery> = [];

export default (app: App) => {
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

  app.component(`cq-${ComponentGroup.name}`, ComponentGroup);
  Object.keys(groups).forEach(key => resolveGroup(groups[key]));
};

export const getGalleryGroup = () => galleryGroup;

export const getGalleryList = () => galleryList;
