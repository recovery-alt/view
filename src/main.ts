import { createApp } from 'vue';
import App from './entry.vue';
import router from './router';
import store from './store';
import { useElement } from './plugins';
import 'normalize.css';

const app = createApp(App);

useElement(app);

app
  .use(store)
  .use(router)
  .mount('#app');
