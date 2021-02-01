import { App, Component } from 'vue';
import { ChartGroup, Components } from '@/typings';

type Gallery = { type: string; name: string };

const packages = require.context('.', true, /(?<!\.)\/index\.ts/);

const reg = /\.\/([\d\w-_]*)\/index\.ts/;

const galleryGroup: Array<{ groupName: string; icon: string; list: Array<Gallery> }> = [];

const galleryList: Array<Gallery> = [];

export default (app: App) => {
  packages.keys().forEach(key => {
    const matcher = key.match(reg);
    const module = packages(key) as ChartGroup;
    if (matcher && matcher[1] && module) {
      const { icon, components, name: groupName } = module;
      const list: Array<Gallery> = [];

      for (const [key, value] of Object.entries(components)) {
        const type = value.component.name || key;
        const name = value.cName;
        app.component(`cq-${type}`, value.component);
        list.push({ type, name });
        galleryList.push({ type, name });
      }
      galleryGroup.push({ groupName, icon, list });
    }
  });
};

export const getGalleryGroup = () => galleryGroup;

export const getGalleryList = () => galleryList;
