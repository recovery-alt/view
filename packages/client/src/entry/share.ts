import { createApp } from 'vue';
import useGallery from '../gallery';
import App from '../app.vue';
import router from '@/router/share';
import 'normalize.css';
import 'animate.css';

const app = createApp(App);

useGallery(app);

app.use(router).mount('#app');
