import { createApp } from 'vue';
import App from '@/app.vue';
import router from '@/router';
import { store, key } from '@/store';
import useGallery from '@/gallery';
import '@/assets/style/index.less';

const start = async () => {
  const app = createApp(App);
  await useGallery(app);

  app.use(store, key).use(router).mount('#app');
};

start();
