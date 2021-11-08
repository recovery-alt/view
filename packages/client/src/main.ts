import { createApp } from 'vue';
import App from './app.vue';
import router from '@/router';
import useGallery from '@/gallery';
import '@/assets/style/index.less';
import { createPinia } from 'pinia';

const start = async () => {
  const app = createApp(App);
  await useGallery(app);

  app.use(router).use(createPinia()).mount('#app');
};

start();
