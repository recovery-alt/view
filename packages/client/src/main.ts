import { createApp } from 'vue';
import App from './app.vue';
import router from '@/router';
import useGallery from '@/gallery';
import '@/assets/style/index.less';
import { createPinia } from 'pinia';
import { createI18n } from 'vue-i18n';

const start = async () => {
  const app = createApp(App);
  app.use(createPinia());
  await useGallery(app);
  app
    .use(createI18n({ legacy: false, locale: 'cn' }))
    .use(router)
    .mount('#app');
};

start();
