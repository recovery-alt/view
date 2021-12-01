import { createSSRApp } from 'vue';
// import useGallery from '@/gallery';
import App from './app.vue';
import { createRouter } from './router';
import 'normalize.css';
import 'animate.css';

export function createApp() {
  const app = createSSRApp(App);
  // useGallery(app);
  const router = createRouter();
  app.use(router);

  return { app, router };
}
