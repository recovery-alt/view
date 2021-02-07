import { App } from 'vue';
import { ChartGroup } from '@/typings';
import basic from './basic';
import chart from './chart';

type Gallery = { type: string; name: string };

const galleryGroup: Array<{
  groupName: string;
  icon: string;
  list: Array<Gallery>;
}> = [];

const galleryList: Array<Gallery> = [];

export default (app: App) => {
  const resolveChartGroup = (chartGroup: ChartGroup) => {
    const { name: groupName, icon, components } = chartGroup;
    const list: Array<Gallery> = [];
    for (const [key, value] of Object.entries(components)) {
      const type = value.component.name || key;
      const name = value.cName;
      app.component(`cq-${type}`, value.component);
      list.push({ type, name });
      galleryList.push({ type, name });
    }
    galleryGroup.push({ groupName, icon, list });
  };
  resolveChartGroup(basic);
  resolveChartGroup(chart);
};

export const getGalleryGroup = () => galleryGroup;

export const getGalleryList = () => galleryList;
