import { createApp } from 'vue';
import App from './app.vue';
import router from '@/router';
import useGallery from '@/gallery';
import '@/assets/style/index.less';
import { createPinia } from 'pinia';
import { createI18n } from 'vue-i18n';

const start = async () => {
  const app = createApp(App);
  const i18n = createI18n({ legacy: false, locale: 'cn' });
  await useGallery(app);

  app.use(i18n).use(router).use(createPinia()).mount('#app');
};

start();
