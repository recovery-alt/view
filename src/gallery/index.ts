import { App } from 'vue';
const packages = require.context('.', true, /(?<!\.)\/index\.ts/);

export default (app: App) => {
  packages.keys().forEach(key => {
    const matcher = key.match(/\.\/(.*)\/index\.ts/);
    if (matcher && matcher[1]) {
      app.component(`v-${matcher[1]}`, packages(key).default);
    }
  });
};
