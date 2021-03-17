import { App } from 'vue';
import { Group, Gallery, GalleryGroup } from '@/typings';
import basic from './basic';
import chart from './chart';
import ComponentGroup from './group.vue';

const galleryGroup: GalleryGroup = [];

const galleryList: Array<Gallery> = [];

export default (app: App) => {
  const resolveGroup = (group: Group) => {
    const { name: groupName, icon, components } = group;
    const list: Array<Gallery> = [];
    for (const value of Object.values(components)) {
      const { type, component } = value;
      app.component(`cq-${type}`, component);
      list.push(value);
      galleryList.push(value);
    }
    galleryGroup.push({ groupName, icon, list });
  };

  resolveGroup(basic);
  resolveGroup(chart);
  app.component(`cq-${ComponentGroup.name}`, ComponentGroup);
};

export const getGalleryGroup = () => galleryGroup;

export const getGalleryList = () => galleryList;
