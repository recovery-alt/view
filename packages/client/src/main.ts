import 'virtual:windi.css';
import { createApp, App } from 'vue';
import Entry from './app.vue';
import router from '@/router';
import useGallery from '@/gallery';
import { createPinia } from 'pinia';
import { createI18n } from 'vue-i18n';
import { global as messages } from '@/locales';
import { useGalleryStore } from '@/store';

async function bootstrap() {
  const app = createApp(Entry);
  app.use(createPinia());
  app.use(createI18n({ legacy: false, locale: 'cn', messages }));
  app.use(router);
  await setGallery(app);
  app.mount('#app');
}

async function setGallery(app: App) {
  const { list, group } = await useGallery(app);
  const gallery = useGalleryStore();
  gallery.setGroup(group);
  gallery.setList(list);
}

bootstrap();
