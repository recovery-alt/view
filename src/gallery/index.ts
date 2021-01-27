import { App, Component } from 'vue';

type Gallery = { type: string; name: string };

const packages = require.context('.', true, /(?<!\.)\/index\.ts/);

const reg = /\.\/([\d\w-_]*)\/index\.ts/;

const galleryGroup: Array<{ groupName: string; icon: string; list: Array<Gallery> }> = [];

const galleryList: Array<Gallery> = [];

export default (app: App) => {
  packages.keys().forEach(key => {
    const matcher = key.match(reg);
    const module = packages(key);
    if (matcher && matcher[1] && module) {
      const groupName: string = module.name;
      const icon = module.icon;
      const components: Data<{ cName: string; component: Component }> = module.components;
      const list: Array<Gallery> = [];

      for (const [key, value] of Object.entries(components)) {
        const type = value.component.name || key;
        const name = value.cName;
        app.component(`v-${type}`, value.component);
        list.push({ type, name });
        galleryList.push({ type, name });
      }
      galleryGroup.push({ groupName, icon, list });
    }
  });
};

export const getGalleryGroup = () => galleryGroup;

export const getGalleryList = () => galleryList;
