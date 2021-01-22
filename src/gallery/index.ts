import { App } from 'vue';
const packages = require.context('.', true, /(?<!\.)\/index\.ts/);

const reg = /\.\/(.*)\/index\.ts/;

const gallery: Array<{ type: string; name: string }> = [];

export default (app: App) => {
  packages.keys().forEach(key => {
    const matcher = key.match(reg);
    if (matcher && matcher[1]) {
      app.component(`v-${matcher[1]}`, packages(key).default);
    }
  });
};

export const getGalleryList = () => {
  if (gallery.length === 0) {
    packages.keys().forEach(key => {
      const matcher = key.match(reg);
      if (matcher && matcher[1]) {
        gallery.push({ type: matcher[1], name: packages(key).name || matcher[1] });
      }
    });
  }
  return gallery;
};
