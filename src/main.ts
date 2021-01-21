import { createApp } from 'vue';
import App from './app.vue';
import router from './router';
import { store, key } from './store';
import { useElement } from './plugins';
import useGallery from './gallery';
import 'normalize.css';

const app = createApp(App);

useElement(app);
useGallery(app);

app
  .use(store, key)
  .use(router)
  .mount('#app');
